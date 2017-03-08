/* jshint node: true */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
var watchify = require('broccoli-watchify');
const mergeTrees = require('broccoli-merge-trees');

const packageName = 'aframe';

module.exports = {
  name: 'ember-aframe-shim',

  included() {
    this._super.included.apply(this, arguments);

    let resolvedPath = require.resolve(packageName);
    this.dirname = path.join(path.dirname(resolvedPath), '..');

    this.import(`vendor/${packageName}/aframe.js`
      , {
        using: [
          { transformation: 'amd', as: packageName }
        ]
      }
    );

    // this.import('vendor/Tween.js'
    //   , {
    //     using: [
    //       { transformation: 'amd', as: 'tween.js' }
    //     ]
    //   }
    // );
  },

  treeForVendor() {
    let tree = new Funnel(this.treeGenerator(`${this.dirname}`), {
      // files: ['index.js'],
      destDir: packageName
    });

    let trees = [];

    trees.push(watchify(tree, {
      browserify: {
        entries: [`./${packageName}/src/index.js`],
        debug: true,
        plugin: ['browserify-derequire'],
        standalone: 'aframe'
      },
      outputFile: `${packageName}/aframe.js`,
      cache: true,
      // init: function (b) {
      //   b.transform('reactify', {'es6': true});
      //   b.external('$');
      // }
    }));

    // trees.push(new Funnel(path.dirname(require.resolve('tween.js')), {
    //   files: ['Tween.js']
    // }));

    return mergeTrees(trees);
  }
};
