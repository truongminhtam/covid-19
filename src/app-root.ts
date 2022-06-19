import { customElement, property, LitElement, html, css } from "lit-element";

interface Country {
  Country: string;
  Slug: string;
  ISO2: string;
}

@customElement("app-root")
export class AppRoot extends LitElement {
  @property()
  data: Array<Country> = [];

  @property()
  searchText: string = "";

  @property({type: Number})
  currentPage: number = 1;
  numberPage: number = 10;
  totalPage: number = 1;

  static get styles() {
    return css`
      h1 {
        font-size: 4rem;
      }
      /* .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        background-color: #2196f3;
        background: linear-gradient(315deg, #b4d2ea 0%, #2196f3 100%);
        font-size: 24px;
      }
      .link {
        color: white;
      } */
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchData();
  }

  async fetchData() {
    const response = fetch("https://api.covid19api.com/countries");
    const jsonresponse = (await response).json();
    this.data = await jsonresponse;
    this.totalPage = Math.ceil(this.data.length / this.numberPage);
    console.log(this.data);
  }

  getdata(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchText = input.value;
    console.log(input.value);
  }

  moveToPage(page: number) {
    this.currentPage = page;
  }

  renderPagination() {
    const currentPage = this.currentPage;
    const totalPage = this.totalPage;

    if (currentPage <= 3) {
      return [
        new Array(5).fill(0).map(
          (_, index) => html`
            <button @click="${() => this.moveToPage(index + 1)}">
              ${index + 1}
            </button>
          `
        ),
        html`<span>...</span>`,
        html`<button @click="${() => this.moveToPage(totalPage)}">
          ${totalPage}
        </button>`,
      ];
    }

    if (currentPage >= 4 && currentPage < totalPage - 2) {
      return [
        html`<button @click="${() => this.moveToPage(1)}">1</button>`,
        html`<span>...</span>`,
        new Array(5).fill(0).map(
          (_, index) => html`
            <button @click="${() => this.moveToPage(currentPage + index - 2)}">
              ${currentPage + index - 2}
            </button>
          `
        ),
        html`<span>...</span>`,
        html`<button @click="${() => this.moveToPage(totalPage)}">
          ${totalPage}
        </button>`,
      ];
    }

    return [
      html`<button @click="${() => this.moveToPage(1)}">1</button>`,
      html`<span>...</span>`,
      new Array(5).fill(0).map(
        (_, index) => html`
          <button @click="${() => this.moveToPage(totalPage + index - 4)}">
            ${totalPage + index - 4}
          </button>
        `
      ),
    ];
  }

  render() {
    return html`
      <div class="wrapper">
        <h1>LitElement + Snowpack</h1>
        <p>Edit <code>src/app-root.ts</code> and save to reload.</p>
        <a
          class="link"
          href="https://lit-element.polymer-project.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
        <input type="text" id="input_data" @input="${this.getdata}" />

        <table>
          ${this.data
            .slice(
              (this.currentPage - 1) * this.numberPage,
              this.currentPage * this.numberPage
            )
            .filter((c) => {
              const country = c.Country.toLowerCase();
              const slug = c.Slug.toLowerCase();
              const iso20 = c.ISO2.toLowerCase();
              const lowerSearchText = this.searchText.toLowerCase();
              return (
                country.includes(lowerSearchText) ||
                slug.includes(lowerSearchText) ||
                iso20.includes(lowerSearchText)
              );

              // return [country, slug, iso20].some(v => v.includes(this.searchText.toLowerCase()))
              // return Object.values(c).map(t => t.toLowerCase()).some(v => v.includes(this.searchText.toLowerCase()))
            })
            .map(
              (country, index) => html`
                <tr>
                  <td>
                    ${(this.currentPage - 1) * this.numberPage + index + 1}
                  </td>
                  <td>${country.Country}</td>
                  <td>${country.Slug}</td>
                  <td>${country.ISO2}</td>
                </tr>
              `
            )}
        </table>
        <div>
          <button
            @click="${() => this.moveToPage(this.currentPage - 1)}"
            ?disabled="${this.currentPage === 1}"
          >
            Back
          </button>
          ${this.renderPagination()}

          <button
            @click="${() => this.moveToPage(this.currentPage + 1)}"
            ?disabled="${this.currentPage === this.totalPage}"
          >
            Next
          </button>
        </div>
      </div>
    `;
  }
}
