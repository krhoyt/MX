export default class MXTabs extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
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
      <div part="bar"></div>
      <slot></slot>
    `;

    // Private
    this._data = null;

    // Events
    this.doTabClick = this.doTabClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$bar = this.shadowRoot.querySelector( 'div' );
  }

  doTabClick( evt ) {
    if( evt.currentTarget.disabled )
      return;

    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( index === this.selectedIndex )
      return;

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: {
        previousIndex: this.selectedIndex,
        selectedIndex: index
      }
    } ) );

    this.selectedIndex = index;
  }

   // When attributes change
  _render() {
    const renderer = this.tabRenderer === null ? 'button' : this.tabRenderer;

    // Remove excess
    while( this.$bar.children.length > this.children.length ) {
      this.$bar.children[0].removeEventListener( 'click', this.doTabClick );
      this.$bar.children[0].remove();
    }

    // Add where needed
    while( this.$bar.children.length < this.children.length ) {
      const tab = document.createElement( renderer );
      tab.addEventListener( 'click', this.doTabClick );
      this.$bar.appendChild( tab );
    }

    const label = this.labelField === null ? 'label' : this.labelField;        
    let index = this.selectedIndex === null ? 0 : this.selectedIndex;

    if( index >= this.children.length )
      index = this.children.length - 1;

    for( let c = 0; c < this.children.length; c++ ) {
      this.$bar.children[c].setAttribute( 'data-index', c );
      this.$bar.children[c].disabled = this.children[c].disabled;      

      if( this.tabRenderer === null ) {
        this.$bar.children[c].innerText = this.children[c][label];
      } else {
        this.$bar.children[c].icon = this.children[c].icon;        
        this.$bar.children[c].label = this.children[c][label];
        this.$bar.children[c].helper = this.children[c].helper;                      
      }

      if( index === c ) {
        this.$bar.children[c].classList.add( 'selected' );      
      } else {
        this.$bar.children[c].classList.remove( 'selected' );              
      }

      this.children[c].hidden = index === c ? false : true;
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
    this._upgrade( 'labelField' );         
    this._upgrade( 'selectedIndex' );        
    this._upgrade( 'tabRenderer' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'label-field',
      'selected-index',
      'tab-renderer'
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

  get labelField() {
    if( this.hasAttribute( 'label-field' ) ) {
      return this.getAttribute( 'label-field' );
    }

    return null;
  }

  set labelField( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-field', value );
    } else {
      this.removeAttribute( 'label-field' );
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
  
  get tabRenderer() {
    if( this.hasAttribute( 'tab-renderer' ) ) {
      return this.getAttribute( 'tab-renderer' );
    }

    return null;
  }

  set tabRenderer( value ) {
    if( value !== null ) {
      this.setAttribute( 'tab-renderer', value );
    } else {
      this.removeAttribute( 'tab-renderer' );
    }
  }              
}

window.customElements.define( 'mx-tabs', MXTabs );
