/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/src/indexeddb-provider.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./scripts/src/indexeddb-provider.ts":
/*!*******************************************!*\
  !*** ./scripts/src/indexeddb-provider.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nwindow.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;\r\nconst KIN_WALLET_STORAGE = 'kin-wallets';\r\nconst KIN_WALLET_STORAGE_BUCKET = 'seeds';\r\nclass IndexedDbKeystoreProvider {\r\n    constructor(_sdk) {\r\n        this._sdk = _sdk;\r\n        this._keypairs = [];\r\n    }\r\n    static get _idb() {\r\n        return new Promise((resolve, reject) => {\r\n            let idb = window.indexedDB.open(KIN_WALLET_STORAGE, 1);\r\n            idb.onerror = (err) => {\r\n                console.error('something is wrong ' + err);\r\n                reject(err);\r\n            };\r\n            idb.onsuccess = (ev) => {\r\n                console.log('established connection');\r\n                resolve(ev.target.result);\r\n            };\r\n            idb.onupgradeneeded = this.onUpgrade;\r\n        });\r\n    }\r\n    static onUpgrade(ev) {\r\n        console.log('onUpgrade fired');\r\n        let db = ev.target.result;\r\n        db.createObjectStore(KIN_WALLET_STORAGE_BUCKET, { keyPath: \"seed\" });\r\n    }\r\n    loadKeypairsFromStorage() {\r\n        return new Promise((done) => __awaiter(this, void 0, void 0, function* () {\r\n            let db = yield IndexedDbKeystoreProvider._idb;\r\n            let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET).objectStore(KIN_WALLET_STORAGE_BUCKET);\r\n            objectStore.getAll().onsuccess = (ev) => {\r\n                this._keypairs = [];\r\n                let results = ev.target.result;\r\n                if (results.length == 0) {\r\n                    console.log('Seed not found');\r\n                }\r\n                else {\r\n                    results.map((result) => {\r\n                        console.log('found stored seed. loading: ' + result.seed);\r\n                        this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(result.seed);\r\n                    });\r\n                }\r\n            };\r\n            objectStore.transaction.oncomplete = () => {\r\n                console.log('connection closed');\r\n                db.close();\r\n                done();\r\n            };\r\n            objectStore.transaction.onerror = (err) => {\r\n                console.log('transaction error ' + err);\r\n                db.close();\r\n            };\r\n        }));\r\n    }\r\n    storeKeypairToStorage(keypair) {\r\n        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {\r\n            let db = yield IndexedDbKeystoreProvider._idb;\r\n            let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET, \"readwrite\").objectStore(KIN_WALLET_STORAGE_BUCKET);\r\n            objectStore.add({ seed: keypair.seed });\r\n            objectStore.transaction.oncomplete = () => {\r\n                console.log('connection closed');\r\n                db.close();\r\n                resolve();\r\n            };\r\n        }));\r\n    }\r\n    addKeyPair(seed) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            let newKeyPair = seed === undefined ? this._sdk.KeyPair.generate() : this._sdk.KeyPair.fromSeed(seed);\r\n            this._keypairs[this._keypairs.length] = newKeyPair;\r\n            yield this.storeKeypairToStorage(newKeyPair);\r\n        });\r\n    }\r\n    get accounts() {\r\n        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {\r\n            console.log('loading keys into memory');\r\n            yield this.loadKeypairsFromStorage();\r\n            resolve(this._keypairs.map(keypair => keypair.publicAddress));\r\n        }));\r\n    }\r\n    sign(accountAddress, transactionEnvelpoe) {\r\n        const keypair = this._keypairs.find(acc => acc.publicAddress == accountAddress);\r\n        if (keypair != null) {\r\n            const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);\r\n            const signers = [];\r\n            signers.push(this._sdk.BaseKeyPair.fromSecret(keypair.seed));\r\n            tx.sign(...signers);\r\n            return Promise.resolve(tx.toEnvelope().toXDR(\"base64\").toString());\r\n        }\r\n        else {\r\n            return Promise.reject(\"keypair null\");\r\n        }\r\n    }\r\n}\r\nexports.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider;\r\nwindow.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL3NyYy9pbmRleGVkZGItcHJvdmlkZXIudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9pbmRleGVkZGItcHJvdmlkZXIudHM/OTRhZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBLaW5TZGsgZnJvbSBcIkBraW5lY29zeXN0ZW0va2luLXNkay1qc1wiO1xyXG5cclxud2luZG93LmluZGV4ZWREQiA9IHdpbmRvdy5pbmRleGVkREIgfHwgd2luZG93Lm1vekluZGV4ZWREQiB8fCB3aW5kb3cud2Via2l0SW5kZXhlZERCIHx8IHdpbmRvdy5tc0luZGV4ZWREQjtcclxuZGVjbGFyZSBnbG9iYWwge1xyXG5cdGludGVyZmFjZSBXaW5kb3cge1xyXG5cdFx0SW5kZXhlZERiS2V5c3RvcmVQcm92aWRlcjogdHlwZW9mIEluZGV4ZWREYktleXN0b3JlUHJvdmlkZXJcclxuXHRcdGluZGV4ZWREQjogYW55LFxyXG5cdFx0bW96SW5kZXhlZERCOiBhbnksXHJcblx0XHR3ZWJraXRJbmRleGVkREI6IGFueSxcclxuXHRcdG1zSW5kZXhlZERCOiBhbnlcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IEtJTl9XQUxMRVRfU1RPUkFHRSA9ICdraW4td2FsbGV0cyc7XHJcbmNvbnN0IEtJTl9XQUxMRVRfU1RPUkFHRV9CVUNLRVQgPSAnc2VlZHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4ZWREYktleXN0b3JlUHJvdmlkZXIgaW1wbGVtZW50cyBLaW5TZGsuS2V5c3RvcmVQcm92aWRlciB7XHJcblx0cHJpdmF0ZSBfa2V5cGFpcnM6IEtpblNkay5LZXlQYWlyW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX3NkazogdHlwZW9mIEtpblNkaykge1xyXG5cdFx0dGhpcy5fa2V5cGFpcnMgPSBbXTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgX2lkYigpOiBQcm9taXNlPElEQkRhdGFiYXNlPntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBpZGIgPSB3aW5kb3cuaW5kZXhlZERCLm9wZW4oS0lOX1dBTExFVF9TVE9SQUdFLCAxKTtcclxuXHRcdFx0aWRiLm9uZXJyb3IgPSAoZXJyOiBhbnkpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdzb21ldGhpbmcgaXMgd3JvbmcgJyArIGVycik7XHJcblx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdH07XHJcblx0XHRcdGlkYi5vbnN1Y2Nlc3MgPSAoZXY6IGFueSkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdlc3RhYmxpc2hlZCBjb25uZWN0aW9uJyk7XHJcblx0XHRcdFx0cmVzb2x2ZShldi50YXJnZXQucmVzdWx0KTtcclxuXHRcdFx0fTtcclxuXHRcdFx0aWRiLm9udXBncmFkZW5lZWRlZCA9IHRoaXMub25VcGdyYWRlXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0c3RhdGljIG9uVXBncmFkZShldjogYW55KXtcclxuXHRcdGNvbnNvbGUubG9nKCdvblVwZ3JhZGUgZmlyZWQnKTtcclxuXHRcdGxldCBkYjogSURCRGF0YWJhc2UgPSBldi50YXJnZXQucmVzdWx0O1xyXG5cdFx0ZGIuY3JlYXRlT2JqZWN0U3RvcmUoS0lOX1dBTExFVF9TVE9SQUdFX0JVQ0tFVCwgeyBrZXlQYXRoOiBcInNlZWRcIiB9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgbG9hZEtleXBhaXJzRnJvbVN0b3JhZ2UoKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgZG9uZSA9PiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IEluZGV4ZWREYktleXN0b3JlUHJvdmlkZXIuX2lkYjtcclxuXHRcdFx0bGV0IG9iamVjdFN0b3JlID0gZGIudHJhbnNhY3Rpb24oS0lOX1dBTExFVF9TVE9SQUdFX0JVQ0tFVCkub2JqZWN0U3RvcmUoS0lOX1dBTExFVF9TVE9SQUdFX0JVQ0tFVCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvYmplY3RTdG9yZS5nZXRBbGwoKS5vbnN1Y2Nlc3MgPSAoZXY6IGFueSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuX2tleXBhaXJzID0gW107XHJcblx0XHRcdFx0bGV0IHJlc3VsdHMgPSBldi50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRcdGlmIChyZXN1bHRzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnU2VlZCBub3QgZm91bmQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzdWx0cy5tYXAoKHJlc3VsdDogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdmb3VuZCBzdG9yZWQgc2VlZC4gbG9hZGluZzogJyArIHJlc3VsdC5zZWVkKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5fa2V5cGFpcnNbdGhpcy5fa2V5cGFpcnMubGVuZ3RoXSA9IHRoaXMuX3Nkay5LZXlQYWlyLmZyb21TZWVkKHJlc3VsdC5zZWVkKVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0b2JqZWN0U3RvcmUudHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9ICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnY29ubmVjdGlvbiBjbG9zZWQnKTtcclxuXHRcdFx0XHRkYi5jbG9zZSgpO1xyXG5cdFx0XHRcdGRvbmUoKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdG9iamVjdFN0b3JlLnRyYW5zYWN0aW9uLm9uZXJyb3IgPSAoZXJyKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ3RyYW5zYWN0aW9uIGVycm9yICcgKyBlcnIpO1xyXG5cdFx0XHRcdGRiLmNsb3NlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHN0b3JlS2V5cGFpclRvU3RvcmFnZShrZXlwYWlyOiBLaW5TZGsuS2V5UGFpcil7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgcmVzb2x2ZSA9PiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IEluZGV4ZWREYktleXN0b3JlUHJvdmlkZXIuX2lkYjtcclxuXHRcdFx0bGV0IG9iamVjdFN0b3JlID0gZGIudHJhbnNhY3Rpb24oS0lOX1dBTExFVF9TVE9SQUdFX0JVQ0tFVCwgXCJyZWFkd3JpdGVcIikub2JqZWN0U3RvcmUoS0lOX1dBTExFVF9TVE9SQUdFX0JVQ0tFVCk7XHJcblx0XHRcdG9iamVjdFN0b3JlLmFkZCh7c2VlZDoga2V5cGFpci5zZWVkfSk7XHJcblx0XHRcdG9iamVjdFN0b3JlLnRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2Nvbm5lY3Rpb24gY2xvc2VkJyk7XHJcblx0XHRcdFx0ZGIuY2xvc2UoKTtcclxuXHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgYWRkS2V5UGFpcihzZWVkPzogc3RyaW5nKSB7XHJcblx0XHRsZXQgbmV3S2V5UGFpciA9IHNlZWQgPT09IHVuZGVmaW5lZCA/IHRoaXMuX3Nkay5LZXlQYWlyLmdlbmVyYXRlKCkgOiB0aGlzLl9zZGsuS2V5UGFpci5mcm9tU2VlZChzZWVkKTtcclxuXHRcdHRoaXMuX2tleXBhaXJzW3RoaXMuX2tleXBhaXJzLmxlbmd0aF0gPSBuZXdLZXlQYWlyO1xyXG5cdFx0YXdhaXQgdGhpcy5zdG9yZUtleXBhaXJUb1N0b3JhZ2UobmV3S2V5UGFpcilcclxuXHR9XHJcblxyXG5cdGdldCBhY2NvdW50cygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgcmVzb2x2ZSA9PiB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdsb2FkaW5nIGtleXMgaW50byBtZW1vcnknKTtcclxuXHRcdFx0YXdhaXQgdGhpcy5sb2FkS2V5cGFpcnNGcm9tU3RvcmFnZSgpO1xyXG5cdFx0XHRyZXNvbHZlKHRoaXMuX2tleXBhaXJzLm1hcChrZXlwYWlyID0+IGtleXBhaXIucHVibGljQWRkcmVzcykpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2lnbihhY2NvdW50QWRkcmVzczogc3RyaW5nLCB0cmFuc2FjdGlvbkVudmVscG9lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cdFx0Y29uc3Qga2V5cGFpciA9IHRoaXMuX2tleXBhaXJzLmZpbmQoYWNjID0+IGFjYy5wdWJsaWNBZGRyZXNzID09IGFjY291bnRBZGRyZXNzKTtcclxuXHRcdGlmIChrZXlwYWlyICE9IG51bGwpIHtcclxuXHRcdFx0Y29uc3QgdHggPSBuZXcgdGhpcy5fc2RrLlhkclRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uRW52ZWxwb2UpO1xyXG5cdFx0XHRjb25zdCBzaWduZXJzID0gW107XHJcblx0XHRcdHNpZ25lcnMucHVzaCh0aGlzLl9zZGsuQmFzZUtleVBhaXIuZnJvbVNlY3JldChrZXlwYWlyLnNlZWQpKTtcclxuXHRcdFx0dHguc2lnbiguLi5zaWduZXJzKTtcclxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0eC50b0VudmVsb3BlKCkudG9YRFIoXCJiYXNlNjRcIikudG9TdHJpbmcoKSk7XHJcblx0XHR9IGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJrZXlwYWlyIG51bGxcIik7IH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG53aW5kb3cuSW5kZXhlZERiS2V5c3RvcmVQcm92aWRlciA9IEluZGV4ZWREYktleXN0b3JlUHJvdmlkZXI7XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBO0FBV0E7QUFDQTtBQUVBO0FBR0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQWhHQTtBQW1HQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./scripts/src/indexeddb-provider.ts\n");

/***/ })

/******/ });