import * as wasm from '../../temporary_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib';
import * as wasm2 from '../../temporary_modules/@emurgo/cardano-message-signing-browser/emurgo_message_signing';

/**
 * Loads the WASM modules
 */
class Loader {
  private _wasm?: typeof wasm;
  private _wasm2?: typeof wasm2;
  async load() {
    if (this._wasm && this._wasm2) return;
    /**
     * @private
     */
    this._wasm = await import(
      '../../temporary_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib'
    );
    /**
     * @private
     */
    this._wasm2 = await import(
      '../../temporary_modules/@emurgo/cardano-message-signing-browser/emurgo_message_signing'
    );
  }

  get Cardano(): typeof wasm {
    return this._wasm!;
  }

  get Message(): typeof wasm2 {
    return this._wasm2!;
  }
}

export default new Loader();
