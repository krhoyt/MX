export default class MXDataGrid extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }        

        :host( [hidden] ) {
          display: none;
        }        

        div[part=empty] {
          display: none;
        }

        div[part=list] {
          display: flex;
          flex-direction: column;
        }

        div[part=list] div {
          display: flex;
          flex-direction: row;
        }

        div[part=list] .selected {
          background-color: var( --list-selected-background-color, transparent );
        }
      </style>
      <div part="header">
        <slot></slot>
      </div>
      <div part="list"></div>
      <div part="empty">
        <slot name="empty"></slot>
      </div>
    `;

    // Properties
    this._data = null;
    this._provider = [];
    this._selected = [];

    // Events
    this.doItemClick = this.doItemClick.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$empty = shadowRoot.querySelector( 'div[part=empty]' );
    this.$header = shadowRoot.querySelector( 'div[part=header]' );
    this.$list = shadowRoot.querySelector( 'div[part=list]' );
  }

  doItemClick( evt ) {
    if( this.disabled || this.inert ) return;

    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
    const position = this._selected.indexOf( index );

    if( position === -1 ) {
      if( this.multiple ) {
        if( evt.shiftKey ) {
          this._selected.push( index );
        } else {
          this._selected = [index];
        }
      } else {
        this._selected = [index];
      }      
    } else {
      if( this.multiple ) {      
        if( evt.shiftKey ) {
          this._selected.splice( position, 1 );    
        }
      }
    }

    this.selectedIndex = index;

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: {
        selectedIndex: this.selectedIndex,        
        selectedIndices: this.selectedIndices,
        selectedItem: this.selectedItem,
        selectedItems: this.selectedItems
      }
    } ) );
  }

  // When things change
  _render() {
    const columns = this.querySelectorAll( 'mx-column' );

    this.$empty.style.display = this._provider.length === 0 ? 'flex' : 'none';
    this.$list.style.display = this._provider.length === 0 ? 'none' : 'flex';    

    while( this.$list.children.length > this._provider.length ) {
      while( this.$list.children[0].children.length > 0 ) {
        this.$list.children[0].children[0].remove();
      }

      this.$list.children[0].removeEventListener( 'click', this.doItemClick );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._provider.length ) {
      const row = document.createElement( 'div' );
      row.addEventListener( 'click', this.doItemClick );      

      for( let c = 0; c < columns.length; c++ ) {
        const renderer = columns[c].itemRenderer === null ? 'mx-list-item-renderer' : columns[c].itemRenderer;        
        const element = document.createElement( renderer );
        row.appendChild( element );
      }

      this.$list.appendChild( row );
    }

    for( let p = 0; p < this._provider.length; p++ ) {
      if( this.disabled || this.inert ) {
        this.$list.children[p].classList.remove( 'selected' );
      } else {
        // TODO: What about multiples?
        if( this.multiple ) {
          if( this._selected.indexOf( p ) >= 0 ) {
            this.$list.children[p].classList.add( 'selected' );
          } else {
            this.$list.children[p].classList.remove( 'selected' );
          }
        } else {
          if( this.selectedIndex === p ) {
            this.$list.children[p].classList.add( 'selected' );
          } else {
            this.$list.children[p].classList.remove( 'selected' );
          }
        }
      }

      this.$list.children[p].setAttribute( 'data-index', p );

      for( let c = 0; c < columns.length; c++ ) {
        this.$list.children[p].children[c].data = this._provider[p][columns[c].dataField];        
      }

      /*
      if( this._label === null ) {
        if( this.labelField === null ) {
          this.$list.children[p].data = this._provider[p];
        } else {
          this.$list.children[p].data = this._provider[p][this.labelField];          
        }
      } else {
        this.$list.children[p].data = this._label( this._provider[p] );        
      }
      */
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
    this._upgrade( 'disabled' );                
    this._upgrade( 'dataProvider' );                
    this._upgrade( 'hidden' );    
    this._upgrade( 'inert' );        
    this._upgrade( 'multiple' );        
    this._upgrade( 'selectedIndex' );            
    this._upgrade( 'selectedIndices' );
    this._upgrade( 'selectedItem' );                                
    this._upgrade( 'selectedItems' );                
    this._upgrade( 'selectedItemsCompareFunction' );                    
    this._render();
    this.dispatchEvent( new CustomEvent( 'ready' ) );
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'inert',
      'multiple',
      'selected-index'
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

  set dataProvider( value ) {
    if( value === null ) {
      this._provider = [];
    } else {
      if( Array.isArray( value ) ) {
        this._provider = [... value];
      }
    }

    this._render();
  }

  get selectedIndices() {
    return this._selected;
  }

  set selectedIndices( value ) {
    this._selected = value === null ? [] : [... value];
    this._render();
  }

  get selectedItem() {
    return this._selected.length === 0 ? null : this._provider[this._selected[0]];
  }

  set selectedItem( value ) {
    if( this._selected.length > 0 ) {
      this._provider[this._selected[0]] = value === null ? null : Object.assign( {}, value );
    }

    this._render();    
  }

  get selectedItems() {
    this._selected.map( ( value ) => this._provider[value] );
    return this._selected.map( ( value ) => this._provider[value] );
  }  

  set selectedItems( value ) {
    this._selected = [];

    if( value !== null ) {
      for( let p = 0; p < this._provider.length; p++ ) {
        for( let v = 0; v < value.length; v++ ) {
          if( this._compare === null ) {
            if( this._provider[p] === value[v] ) {
              this._selected.push( p );
              break;
            }
          } else {
            if( this._compare( this._provider[p], value[v] ) ) {
              this._selected.push( p );
              break;
            }
          }
        }
      }
    }

    this.selectedIndex = this._selected.length > 0 ? this._selected[this._selected.length - 1] : null;
  }

  get selectedItemsCompareFunction() {
    return this._compare;
  }

  set selectedItemsCompareFunction( value ) {
    this._compare = value;
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

  get inert() {
    return this.hasAttribute( 'inert' );
  }

  set inert( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'inert' );
      } else {
        this.setAttribute( 'inert', '' );
      }
    } else {
      this.removeAttribute( 'inert' );
    }
  }  

  get multiple() {
    return this.hasAttribute( 'multiple' );
  }

  set multiple( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'multiple' );
      } else {
        this.setAttribute( 'multiple', '' );
      }
    } else {
      this.removeAttribute( 'multiple' );
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

window.customElements.define( 'mx-data-grid', MXDataGrid );
