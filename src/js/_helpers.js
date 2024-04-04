
export default class Helpers {
  /**
   * Creates a new DOM element with specified options.
   *
   * @param {string} elementType - The type of element to create (e.g., 'div')
   * @param {object} options - An object containing options for configuring the element
   * @param {string[]} [options.classes] - Array of Classes
   * @param {string} [options.text]
   * @param {string} [options.html]
   * @param {string} [options.id]
   * @param {string} [options.src]
   * @param {string} [options.href]
   * @param {string} [options.type]
   * @param {string} [options.name]
   * @param {string} [options.value]
   * @param {string} [options.style]
   * @param {Object.<string, string>} [options.attributes] - An object containing additional attributes to set for the element.
   * @returns {HTMLElement} The created DOM element.
   */
  createDOMElement = (elementType, options) => {
    const element = document.createElement(elementType);

    if (options) {
      options.classes && options.classes.length > 0 && 
        options.classes.forEach(className => 
          element.classList.add(className));

      options.attributes && 
        Object.keys(options.attributes).forEach(attribute => 
          element.setAttribute(attribute, options.attributes[attribute]));

      options.id && (element.id = options.id);
      options.text && (element.textContent = options.text);
      options.html && (element.innerHTML = options.html);
      options.src && (element.src = options.src);
      options.href && (element.href = options.href);
      options.type && (element.type = options.type);
      options.name && (element.name = options.name);
      options.value && (element.value = options.value);
      options.style && (element.style.cssText = options.style);
      
      if (options.dataset) {
        Object.keys(options.dataset).forEach(key => {
          element.dataset[key] = options.dataset[key];
        });
      }
    }

    return element;
  };
}