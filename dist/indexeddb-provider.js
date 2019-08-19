!function(e){var t={};function o(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=37)}({37:function(e,t,o){"use strict";var r=this&&this.__awaiter||function(e,t,o,r){return new(o||(o=Promise))(function(n,i){function s(e){try{d(r.next(e))}catch(e){i(e)}}function a(e){try{d(r.throw(e))}catch(e){i(e)}}function d(e){e.done?n(e.value):new o(function(t){t(e.value)}).then(s,a)}d((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const n="kin-wallets",i="seeds";class s{constructor(e){this._sdk=e,this._keypairs=new Array}static get _idb(){return new Promise((e,t)=>{let o=window.indexedDB.open(n,1);o.onerror=e=>{console.error("something is wrong "+e),t(e)},o.onsuccess=t=>{console.log("established connection"),e(t.target.result)},o.onupgradeneeded=this.onUpgrade})}static onUpgrade(e){console.log("onUpgrade fired"),e.target.result.createObjectStore(i,{keyPath:"seed"})}loadKeypairsFromStorage(){return new Promise(e=>r(this,void 0,void 0,function*(){let t=yield s._idb,o=t.transaction(i).objectStore(i);o.getAll().onsuccess=e=>{this._keypairs=new Array;let t=e.target.result;0==t.length?console.log("Seed not found"):t.map(e=>{console.log("found stored seed. loading: "+e.seed),this._keypairs[this._keypairs.length]=this._sdk.KeyPair.fromSeed(e.seed)})},o.transaction.oncomplete=()=>{console.log("connection closed"),t.close(),e()},o.transaction.onerror=e=>{console.log("transaction error "+e),t.close()}}))}storeKeypairToStorage(e){return new Promise(t=>r(this,void 0,void 0,function*(){let o=yield s._idb,r=o.transaction(i,"readwrite").objectStore(i);r.add({seed:e.seed}),r.transaction.oncomplete=()=>{console.log("connection closed"),o.close(),t()}}))}addKeyPair(e){return r(this,void 0,void 0,function*(){let t=void 0===e?this._sdk.KeyPair.generate():this._sdk.KeyPair.fromSeed(e);this._keypairs[this._keypairs.length]=t,yield this.storeKeypairToStorage(t)})}get accounts(){return new Promise(e=>r(this,void 0,void 0,function*(){console.log("loading keys into memory"),yield this.loadKeypairsFromStorage(),e(this._keypairs.map(e=>e.publicAddress))}))}sign(e,t){const o=this._keypairs.find(t=>t.publicAddress==e);if(null!=o){const e=new this._sdk.XdrTransaction(t),r=new Array;return r.push(this._sdk.BaseKeyPair.fromSecret(o.seed)),e.sign(...r),Promise.resolve(e.toEnvelope().toXDR("base64").toString())}return Promise.reject("keypair null")}}t.IndexedDbKeystoreProvider=s,window.IndexedDbKeystoreProvider=s}});