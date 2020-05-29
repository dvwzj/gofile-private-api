import fs from 'fs'
import path from 'path'
import axios from 'axios'
import axiosCookieJarSupport  from 'axios-cookiejar-support'
import tough from 'tough-cookie'
import userAgents from 'user-agents'
import FileUploadEmitter from './file-upload-emitter'
import _ from 'lodash'
import FormData from 'form-data'

class GofilePrivateAPI {
  constructor (apiServer) {
    Object.defineProperty(this, 'apiServer', {
      enumerable: false,
      writable: true,
      value: apiServer === undefined ? 'apiv2' : apiServer
    })
    Object.defineProperty(this, 'auth', {
      enumerable: false,
      writable: true
    })
    Object.defineProperty(this, 'axios', {
      enumerable: false,
      writable: true,
      value: axios.create({
        withCredentials: true,
        headers: {
          'user-agent': (new userAgents()).toString()
        }
      })
    })
    Object.defineProperty(this, 'fileUploadEmitter', {
      enumerable: false,
      writable: true,
      value: new FileUploadEmitter()
    })
    Object.defineProperty(this, 'cache', {
      enumerable: false,
      writable: true,
      value: {}
    })
    axiosCookieJarSupport(this.axios)
    this.axios.defaults.jar = new tough.CookieJar()
  }

  async token (token) {
    return new Promise((resolve, reject) => {
      try {
        if (token === undefined || _.isEmpty(token)) {
          throw new Error('TOKEN is required')
        }
        this
          .axios
          .get(`https://${this.apiServer}.gofile.io/verifToken?token=${token}`)
          .then((res) => {
            if (res.data.status === 'ok') {
              this
                .axios
                .get(`https://${this.apiServer}.gofile.io/getAccountInfo?token=${token}`)
                .then((res2) => {
                  if (res2.data.status === 'ok') {
                    this.auth = _.merge(
                      {},
                      res.data.data,
                      res2.data.data
                    )
                    resolve(this)
                  } else {
                    reject('getAccountInfo: ' + res2.data.status)
                  }
                })
                .catch(reject)
            } else {
              reject('verifToken: ' + res.data.status)
            }
          })
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  async uploadsList () {
    return new Promise(async (resolve, reject) => {
      try {
        this
          .axios
          .get(
            `https://${this.apiServer}.gofile.io/getUploadsList?token=${this.auth.token}`
          )
          .then((res) => {
            if (res.data.status === 'ok') {
              resolve(res.data.data)
            } else {
              reject('getUploadsList: ' + res.data.status)
            }
          })
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  async exists (files) {
    return new Promise(async (resolve, reject) => {
      try {
        const uploads = await this.uploadsList()
        const exists = await Promise
          .all(
            _.map(uploads, async (upload) => {
              const a = _.map(upload.files, (file) => {
                return `${file.name}/${file.size}`
              })
                .sort()
              const b = (await Promise.all(_.map(files, (file) => {
                return new Promise(async (resolve2, reject2) => {
                  if (_.isString(file)) {
                    if (file.match(/^https?:\/\//)) {
                      const name = _.last(file.split('?')[0].split('/'))
                      this
                        .axios
                        .head(file)
                        .then(async (res) => {
                          if (res.headers['content-length']) {
                            resolve2(`${name}/${res.headers['content-length']}`)
                          } else {
                            this
                              .axios
                              .get(
                                file,
                                {
                                  responseType: 'arraybuffer'
                                }
                              )
                              .then((res2) => {
                                this.cache[file] = res2.data
                                resolve2(`${name}/${_.size(res2.data)}`)
                              })
                              .catch(reject2)
                          }
                        })
                        .catch(reject2)
                    } else {
                      resolve2(`${path.basename(file)}/${fs.statSync(file).size}`)
                    }
                  } else if (_.isObject(file) && file.name && file.blob) {
                    resolve2(`${file.name}/${_.size(file.blob)}`)
                  } else {
                    resolve2(false)
                  }
                })
              })))
                .sort()
              return _.isEqual(a, b)
            })
          )
          .then((results) => {
            return _.filter(
              _.map(results, (found, i) => {
                return found ? uploads[i] : false
              })
            )
          })
          .catch((e) => {
            this.fileUploadEmitter.emit('error', e)
            return []
          })
        resolve(exists)
      } catch (e) {
        reject(e)
      }
    })
  }

  upload (files, force) {
    try {
      if (files === undefined || _.isEmpty(_.filter(files))) {
        this.fileUploadEmitter.emit('error', new Error('Cannot upload EMPTY Files'))
      } else {
        if (!_.isArray(files)) files = [ files ]
        force = force === undefined ? false : force
        if (force === true) {
          this.forceUpload(files)
        } else {
          this
            .exists(files)
            .then((exists) => {
              if (_.size(exists)) {
                this.fileUploadEmitter.emit('completed', exists[0])
              } else {
                this.forceUpload(files)
              }
            })
            .catch((e) => {
              this.fileUploadEmitter.emit('error', e)
            })
        }
      }
    } catch (e) {
      this.fileUploadEmitter.emit('error', e)
    }
    return this.fileUploadEmitter
  }

  forceUpload (files) {
    try {
      this
        .axios
        .get(
          `https://${this.apiServer}.gofile.io/getServer`
        )
        .then(async (res) => {
          if (res.data.status === 'ok') {
            const formData = new FormData()
            formData.append('email', this.auth.email)
            await Promise
              .all(
                _.map(files, async (file) => {
                  let data, name
                  if (file.match(/^https?:\/\//)) {
                    if (this.cache[file]) {
                      data = this.cache[file]
                    } else {
                      data = await this
                        .axios
                        .get(
                          file,
                          {
                            responseType: 'arraybuffer'
                          }
                        )
                        .then((res) => {
                          return res.data
                        })
                        .catch((e) => {
                          this.fileUploadEmitter.emit('error', e)
                        })
                    }
                    name = _.last(file.split('?')[0].split('/'))
                  } else {
                    data = fs.readFileSync(file)
                    name = path.basename(file)
                  }
                  formData.append('filesUploaded', data, name)
                })
              )
              .catch((e) => {
                this.fileUploadEmitter.emit('error', e)
              })
            formData.append('category', 'file')
            formData.append('comments', 0)
            this
              .axios
              .post(
                `https://${res.data.data.server}.gofile.io/upload`,
                formData,
                {
                  headers: formData.getHeaders()
                }
              )
              .then((res2) => {
                if (res2.data.status === 'ok') {
                  this
                    .axios
                    .get(
                      `https://${this.apiServer}.gofile.io/getServer?c=${res2.data.data.code}`
                    )
                    .then((res3) => {
                      if (res3.data.status === 'ok') {
                        this
                          .axios
                          .get(
                            `https://${res3.data.data.server}.gofile.io/getUpload?c=${res2.data.data.code}`
                          )
                          .then((res4) => {
                            if (res4.data.status === 'ok') {
                              this.fileUploadEmitter.emit('completed', res4.data.data)
                            } else {
                              this.fileUploadEmitter.emit('error', 'getUpload: ' + res4.data.status)
                            }
                          })
                          .catch((e) => {
                            this.fileUploadEmitter.emit('error', e)
                          })
                      } else {
                        this.fileUploadEmitter.emit('error', 'getServer: ' + res3.data.status)
                      }
                    })
                    .catch((e) => {
                      this.fileUploadEmitter.emit('error', e)
                    })
                } else {
                  this.fileUploadEmitter.emit('error', 'upload: ' + res2.data.status)
                }
              })
              .catch((e) => {
                this.fileUploadEmitter.emit('error', e)
              })
          } else {
            this.fileUploadEmitter.emit('error', 'getServer: ' + res.data.status)
          }
        })
        .catch((e) => {
          this.fileUploadEmitter.emit('error', e)
        })
    } catch (e) {
      this.fileUploadEmitter.emit('error', e)
    }
    return this.fileUploadEmitter
  }
}

export default GofilePrivateAPI
