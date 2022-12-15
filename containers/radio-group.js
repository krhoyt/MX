export default class MXRadioGroup extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
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

    // Private
    this._data = null;

    // Events
    this.doChildClick = this.doChildClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => this.doSlotChange() );
  }

  doChildClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( this.selectedIndex !== index ) {
      this.selectedIndex = index;
      this.dispatchEvent( new CustomEvent( 'change', {
        detail: {
          selectedIndex: this.selectedIndex
        }
      } ) );
    }
  }

  doSlotChange() {
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].removeEventListener( 'click', this.doChildClick );
      this.children[c].addEventListener( 'click', this.doChildClick );    
      this.children[c].setAttribute( 'data-index', c );  
    }
  }

   // When attributes change
  _render() {
    const selected = this.selectedIndex === null ? 0 : this.selectedIndex;

    for( let c = 0; c < this.children.length; c++ ) {
      if( c === selected ) {
        this.children[c].classList.add( 'selected' );
      } else {
        this.children[c].classList.remove( 'selected' );
      }
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
    this._upgrade( 'concealed' );        
    this._upgrade( 'data' );                
    this._upgrade( 'hidden' );    
    this._upgrade( 'selectedIndex' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'selected-index'
    ];
  }

  // Observed attribute has changed
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

  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
    }
  }           
}

window.customElements.define( 'mx-radio-group', MXRadioGroup );
