export default class MXTabRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }        

        :host( [hidden] ) {
          display: none;
        }
        
        button {
          -webkit-tap-highlight-color: transparent;                    
        }

        div {
          display: flex;
          flex-direction: column;
        }

        p {
          text-rendering: optimizeLegibility;
        }

        :host( .selected ) button {
          color: red;
        }

        :host( :not( [helper] ) ) p[part=helper] {
          display: none;
        }

        :host( :not( [icon] ) ) i {
          display: none;
        }        
      </style>
      <button part="button">
        <i part="icon"></i>
        <div>
          <p part="label"></p>
          <p part="helper"></p>
        </div>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
    this.$helper = shadowRoot.querySelector( 'p[part=helper]' );    
    this.$icon = shadowRoot.querySelector( 'i' );
    this.$label = shadowRoot.querySelector( 'p[part=label]' );
  }

  // When things change
  _render() {
    this.$button.disabled = this.disabled;    
    this.$icon.innerText = this.icon === null ? '' : this.icon;
    this.$label.innerText = this.label === null ? '' : this.label;
    this.$helper.innerText = this.helper === null ? '' : this.helper;
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }    

  // Setup
  connectedCallback() {
    this._upgrade( 'data' );      
    this._upgrade( 'disabled' );                          
    this._upgrade( 'helper' );    
    this._upgrade( 'hidden' );                            
    this._upgrade( 'icon' );                    
    this._upgrade( 'label' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'helper',
      'hidden',
      'icon',
      'label'
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

  // Attributes
  // Reflected
  // Boolean, Number, String, null  
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

  get helper() {
    if( this.hasAttribute( 'helper' ) ) {
      return this.getAttribute( 'helper' );
    }

    return null;
  }

  set helper( value ) {
    if( value !== null ) {
      this.setAttribute( 'helper', value );
    } else {
      this.removeAttribute( 'helper' );
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

  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
    }
  }            

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }            
}

window.customElements.define( 'mx-tab-renderer', MXTabRenderer );
