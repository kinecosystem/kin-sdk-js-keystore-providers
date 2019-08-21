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
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/src/simple-provider.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./scripts/src/simple-provider.ts":
/*!****************************************!*\
  !*** ./scripts/src/simple-provider.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass SimpleKeystoreProvider {\r\n    constructor(_sdk, _seed) {\r\n        this._sdk = _sdk;\r\n        this._keypairs = [];\r\n        this._keypairs[0] = _seed !== undefined ? this._sdk.KeyPair.fromSeed(_seed) : this._sdk.KeyPair.generate();\r\n    }\r\n    addKeyPair() {\r\n        this._keypairs[this._keypairs.length] = this._sdk.KeyPair.generate();\r\n    }\r\n    get accounts() {\r\n        return Promise.resolve(this._keypairs.map(keypair => keypair.publicAddress));\r\n    }\r\n    sign(accountAddress, transactionEnvelpoe) {\r\n        const keypair = this.getKeyPairFor(accountAddress);\r\n        if (keypair != null) {\r\n            const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);\r\n            const signers = [];\r\n            signers.push(this._sdk.BaseKeyPair.fromSecret(keypair.seed));\r\n            tx.sign(...signers);\r\n            return Promise.resolve(tx.toEnvelope().toXDR(\"base64\").toString());\r\n        }\r\n        else {\r\n            return Promise.reject(\"keypair null\");\r\n        }\r\n    }\r\n    getKeyPairFor(publicAddress) {\r\n        return (this._keypairs.find(keypair => keypair.publicAddress === publicAddress) || null);\r\n    }\r\n}\r\nexports.SimpleKeystoreProvider = SimpleKeystoreProvider;\r\nwindow.SimpleKeystoreProvider = SimpleKeystoreProvider;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL3NyYy9zaW1wbGUtcHJvdmlkZXIudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9zaW1wbGUtcHJvdmlkZXIudHM/YmFmOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBLaW5TZGsgZnJvbSBcIkBraW5lY29zeXN0ZW0va2luLXNkay1qc1wiO1xyXG5cclxuZGVjbGFyZSBnbG9iYWx7XHJcblx0aW50ZXJmYWNlIFdpbmRvdyB7XHJcblx0XHRTaW1wbGVLZXlzdG9yZVByb3ZpZGVyOiB0eXBlb2YgU2ltcGxlS2V5c3RvcmVQcm92aWRlclxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ICBjbGFzcyBTaW1wbGVLZXlzdG9yZVByb3ZpZGVyIGltcGxlbWVudHMgS2luU2RrLktleXN0b3JlUHJvdmlkZXIge1xyXG5cdHByaXZhdGUgX2tleXBhaXJzOiBLaW5TZGsuS2V5UGFpcltdO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9zZGs6IHR5cGVvZiBLaW5TZGssIF9zZWVkPzogc3RyaW5nKSB7XHJcblx0XHR0aGlzLl9rZXlwYWlycyA9IFtdO1xyXG5cdFx0dGhpcy5fa2V5cGFpcnNbMF0gPSBfc2VlZCAhPT0gdW5kZWZpbmVkID8gdGhpcy5fc2RrLktleVBhaXIuZnJvbVNlZWQoX3NlZWQpIDogdGhpcy5fc2RrLktleVBhaXIuZ2VuZXJhdGUoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRLZXlQYWlyKCkge1xyXG5cdFx0dGhpcy5fa2V5cGFpcnNbdGhpcy5fa2V5cGFpcnMubGVuZ3RoXSA9IHRoaXMuX3Nkay5LZXlQYWlyLmdlbmVyYXRlKCk7XHJcblx0fVxyXG5cclxuXHRnZXQgYWNjb3VudHMoKSB7XHJcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2tleXBhaXJzLm1hcChrZXlwYWlyID0+IGtleXBhaXIucHVibGljQWRkcmVzcykpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNpZ24oYWNjb3VudEFkZHJlc3M6IHN0cmluZywgdHJhbnNhY3Rpb25FbnZlbHBvZTogc3RyaW5nKSB7XHJcblx0XHRjb25zdCBrZXlwYWlyID0gdGhpcy5nZXRLZXlQYWlyRm9yKGFjY291bnRBZGRyZXNzKTtcclxuXHRcdGlmIChrZXlwYWlyICE9IG51bGwpIHtcclxuXHRcdFx0Y29uc3QgdHggPSBuZXcgdGhpcy5fc2RrLlhkclRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uRW52ZWxwb2UpO1xyXG5cdFx0XHRjb25zdCBzaWduZXJzID0gW107XHJcblx0XHRcdHNpZ25lcnMucHVzaCh0aGlzLl9zZGsuQmFzZUtleVBhaXIuZnJvbVNlY3JldChrZXlwYWlyLnNlZWQpKTtcclxuXHRcdFx0dHguc2lnbiguLi5zaWduZXJzKTtcclxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0eC50b0VudmVsb3BlKCkudG9YRFIoXCJiYXNlNjRcIikudG9TdHJpbmcoKSk7XHJcblx0XHR9IGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJrZXlwYWlyIG51bGxcIik7IH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRLZXlQYWlyRm9yKHB1YmxpY0FkZHJlc3M6IHN0cmluZykge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9rZXlwYWlycy5maW5kKGtleXBhaXIgPT4ga2V5cGFpci5wdWJsaWNBZGRyZXNzID09PSBwdWJsaWNBZGRyZXNzKSB8fCBudWxsKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG53aW5kb3cuU2ltcGxlS2V5c3RvcmVQcm92aWRlciA9IFNpbXBsZUtleXN0b3JlUHJvdmlkZXI7XHJcbiJdLCJtYXBwaW5ncyI6Ijs7QUFRQTtBQUdBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBOUJBO0FBaUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./scripts/src/simple-provider.ts\n");

/***/ })

/******/ });