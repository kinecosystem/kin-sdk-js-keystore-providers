const SEED = "SARVSAHEAIHNN3WTCUX2YPNHPXB2PUDL3UBK3Z4RZMNPXDNUG5QD5VFF";
const PK = "GCEMQWMFAFO5UOZHNVFQTAGQG7F3KAVNNA5TWIMO7XPJIRGU4WR3NHQJ";
const RECIVER_PK = "GD5LWUF54MHZRZHFYFCHZ53TUVT3TWIGDM2JNRJDDWKBD4EZGQPEFULF";
const COOKIE_MAX_LIFE = 3600 * 24; // 24h

const keyStoreProvider = new ExtensionKeystoreProvider(KinSdk);
const kinClient = new KinSdk.KinClient(KinSdk.Environment.Testnet, keyStoreProvider);

Vue.config.productionTip = false;
new Vue({
  el: "#root",
  data: {
    accounts: []
  },
  created: function() {
    this.refreshLocalStorageAccounts();
  },
  methods: {
    installExtension: function() {
      const cookie = `kin_ext_install_source='${window.location.hostname}';`;
      const maxAge = `max-age=${COOKIE_MAX_LIFE};`;
      const path = "path=/;";
      document.cookie = cookie.concat(maxAge, path);
      if (this._properties.extension_auto_install) {
        window.open(EXTENSION_URL);
      }
    },
    refreshLocalStorageAccounts: function() {
      console.log("app: get accounts");
      kinClient.kinAccounts
        .then(accounts => {
          console.log("app: get accounts -> then");
          this.accounts = accounts.map(account => {
            account.balance = 0;
            return account;
          });
          this.activateAccounts();
          this.refreshBalances();
        })
        .catch(err => {
          console.log(err);
        });
    },
    tipSomeone: function() {
      this.accounts[0]
        .buildTransaction({
          address: RECIVER_PK,
          amount: 1,
          fee: 100,
          memoText: "Tip some kin"
        })
        .then(txBuilder => {
          return this.accounts[0].submitTransaction(txBuilder.toString());
        })
        .then(txId => {
          console.log(`tipped: ${txId}`);
          this.refreshBalances();
        });
    },
    createLocalStorageAccount: function() {
      let isAlreadyLoaded = this.accounts.some(account => account._publicAddress == PK);
      if (isAlreadyLoaded) {
        console.log("account was already loaded");
      } else {
        keyStoreProvider._localStorageProvider.add(SEED);
        this.refreshLocalStorageAccounts();
      }
    },
    refreshBalances: function() {
      this.accounts.forEach(account => {
        account.getBalance().then(balance => {
          account.balance = balance;
        });
      });
    },
    activateAccounts: function() {
      this.accounts.forEach(account => {
        account.isAccountExisting().then(exists => {
          if (!exists) {
            kinClient.friendbot({
              address: account._publicAddress,
              amount: 1000
            });
          }
        });
      });
    }
  }
});
