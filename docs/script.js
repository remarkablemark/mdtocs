// Load `mdtocs`
var script = document.createElement('script');
script.src =
  location.hostname === ''
    ? '../umd/mdtocs.min.js'
    : 'https://unpkg.com/mdtocs@latest/umd/mdtocs.min.js';
document.body.append(script);

// Initialize app
script.addEventListener('load', function () {
  var mdtocs = window.mdtocs.mdtocs;
  var MDCTextField = window.mdc.textField.MDCTextField;
  var MDCRipple = window.mdc.ripple.MDCRipple;
  var prettier = window.prettier;
  var prettierOptions = { parser: 'markdown', plugins: window.prettierPlugins };

  // Instantiate MDC elements
  var textFields = document.querySelectorAll('.mdc-text-field--textarea');
  var md = new MDCTextField(textFields[0]);
  var toc = new MDCTextField(textFields[1]);
  var copyButton = new MDCRipple(document.querySelector('.mdc-button'));
  var tocFloatLabel = toc.getLabelAdapterMethods_().floatLabel;

  // Generate table of contents from Markdown input
  md.listen('input', function (event) {
    var markdown = event.target.value;
    var tableOfContents = mdtocs(markdown);
    tocFloatLabel(Boolean(tableOfContents));
    toc.value = prettier.format(tableOfContents, prettierOptions);
  });

  // Copy table of contents to clipboard
  copyButton.listen('click', function () {
    toc.disabled = false;
    toc.input_.select();
    toc.disabled = true;
    document.execCommand('copy');
  });
});
