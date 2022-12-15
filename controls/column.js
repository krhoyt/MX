export default class MXColumn extends HTMLElement {
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
      </style>
      <button part="button">
        <slot></slot>
        <span part="icon"></span>
      </button>
    `;

    // Properties
    this._data = null;
    this._label = null;
    this._sort = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
  }

  // When things change
  _render() {
    if( this.headerText !== null ) {
      this.$button.innerText = this.headerText;
    }
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
    this._upgrade( 'dataField' );        
    this._upgrade( 'headerText' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'itemRenderer' );    
    this._upgrade( 'labelFunction' );        
    this._upgrade( 'sortable' );         
    this._upgrade( 'sortCompareFunction' );   
    this._upgrade( 'truncate' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'data-field',      
      'header-text',
      'hidden',
      'item-renderer',
      'sortable',
      'truncate'
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

  get labelFunction() {
    return this._label;
  }

  set labelFunction( value ) {
    this._label = value;
  }

  get sortCompareFunction() {
    return this._sort;
  }

  set sortCompareFunction( value ) {
    this._sort = value;
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get dataField() {
    if( this.hasAttribute( 'data-field' ) ) {
      return this.getAttribute( 'data-field' );
    }

    return null;
  }

  set dataField( value ) {
    if( value !== null ) {
      this.setAttribute( 'data-field', value );
    } else {
      this.removeAttribute( 'data-field' );
    }
  }     

  get headerText() {
    if( this.hasAttribute( 'header-text' ) ) {
      return this.getAttribute( 'header-text' );
    }

    return null;
  }

  set headerText( value ) {
    if( value !== null ) {
      this.setAttribute( 'header-text', value );
    } else {
      this.removeAttribute( 'header-text' );
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

  get itemRenderer() {
    if( this.hasAttribute( 'item-renderer' ) ) {
      return this.getAttribute( 'item-renderer' );
    }

    return null;
  }

  set itemRenderer( value ) {
    if( value !== null ) {
      this.setAttribute( 'item-renderer', value );
    } else {
      this.removeAttribute( 'item-renderer' );
    }
  }     

  get sortable() {
    return this.hasAttribute( 'sortable' );
  }

  set sortable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'sortable' );
      } else {
        this.setAttribute( 'sortable', '' );
      }
    } else {
      this.removeAttribute( 'sortable' );
    }
  }  

  get truncate() {
    return this.hasAttribute( 'truncate' );
  }

  set truncate( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'truncate' );
      } else {
        this.setAttribute( 'truncate', '' );
      }
    } else {
      this.removeAttribute( 'truncate' );
    }
  }  
}

window.customElements.define( 'mx-column', MXColumn );
