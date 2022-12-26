export default class MXForm extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }        

        :host( [hidden] ) {
          display: none;
        }        
      </style>
      <slot></slot>
    `;

    // Properties
    this._data = null;
    this._provider = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  clear() {
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].clear();
    }
  }

  validate() {
    for( let c = 0; c < this.children.length; c++ ) {
      if( !this.children[c].validate() ) {
        return false;
      }
    }

    return true;
  }

  // When things change
  _render() {
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].disabled = this.disabled;
      this.children[c].readOnly = this.readOnly;
    }
  }

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }    

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );        
    this._upgrade( 'data' );    
    this._upgrade( 'dataProvider' );            
    this._upgrade( 'disabled' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'readOnly' );        
    this._upgrade( 'value' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'read-only'   
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  get dataProvider() {
    return this._provider.length === 0 ? null : this._provider;
  }

  set dataProvider( fields ) {
    this._provider = fields === null ? [] : [... fields];

    while( this.children.length > 0 ) {
      this.children[0].remove();
    }

    for( let p = 0; p < this._provider.length; p++ ) {
      const element = document.createElement( this._provider[p].type );
      element.name = this._provider[p].name;

      if( this._provider[p].hasOwnProperty( 'attributes' ) ) {
        const keys = Object.keys( this._provider[p].attributes );
        for( let k = 0; k < keys.length; k++ ) {
          element[keys[k]] = this._provider[p].attributes[keys[k]];
        }
      }

      this.appendChild( element );
    }
  }  

  get value() {
    const result = {};

    for( let c = 0; c < this.children.length; c++ ) {
      result[this.children[c].name] = this.children[c].value;
    }

    return result;
  }

  set value( item ) {
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].value = item[this.children[c].name];
    }
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }

  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }  

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }  

  get readOnly() {
    return this.hasAttribute( 'read-only' );
  }

  set readOnly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'read-only' );
      } else {
        this.setAttribute( 'read-only', '' );
      }
    } else {
      this.removeAttribute( 'read-only' );
    }
  }    
}

window.customElements.define( 'mx-form', MXForm );
