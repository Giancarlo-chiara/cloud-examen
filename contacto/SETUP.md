# Contacto

## Start here

Open index.html to see the complete form, or serve this folder with a local HTTP server. All display dependencies are included; no build step is needed.

Delivery: CONNECT LATER. This is an unconnected draft. Its submit button never claims to send a message. Do not use it to collect real responses yet.

## Install in an existing website

1. Copy form-snippet.html into your page. Copy form.css and form.js into your assets folder.
2. Add a stylesheet link to form.css in your page head, and a deferred script for form.js near the end of the page.
3. The form styles are scoped to this project. Test it beside your existing website styles.
4. Use a distinct Workbench project (Duplicate project) for a second form on the same page so element IDs remain unique.

## Connect responses

Reopen project.form.json in Form Workbench. Choose My endpoint or Formspree, set a public endpoint and download a revised ZIP. For Formspree see https://formspree.io/html/ .

Every field has a stable name. Checkbox groups use name[] and may send repeated values. Unchecked checkboxes are omitted. Date/time fields use local date/time strings and send request_timezone separately. Changing a field label does not change its submission name.

Your server/service must validate every input, enforce required checkbox groups and handle spam/rate limits. Frontend checks can be bypassed. Keep secret API keys and credentials on your server. Test with fictional data only after activating/configuring your endpoint. Endpoint entry is not a delivery test. There is no hosted backend, inbox, authentication, payment or availability system in this ZIP.

## Draft behavior and JavaScript

Connected forms use native POST and still submit without JavaScript; the endpoint must validate them. Required checkbox groups rely on the included enhancement and server-side checks. Unconnected drafts prevent submission with the included runtime and an inline draft guard; without JavaScript, the visible draft notice still applies and no endpoint is configured. A restrictive website CSP may require adapting its script/style policy; do not remove security policies blindly.

## Rows and field widths

Field rows and widths are included in the HTML/CSS and project backup. Fields follow their reading order, wrap when a row is full and stack into one column when the form body is 420px wide or less. Reopen the project to change widths, pair neighbors or start a new row. No editor controls are included in this exported form.

## Edit again

Open this original ZIP or project.form.json in Form Workbench. The project file is your editable backup; hand-edited HTML is not imported. Recompressed ZIPs are not supported in this prototype: import the project JSON instead. Browser saves are local to that browser/device. Clearing browser storage removes local projects but not this downloaded backup. Never store real respondent answers in a project file.

## License

Original generated code and runtime are MIT licensed, with no required visual badge or backlink. Preserve LICENSE.txt when redistributing source.  Your existing template and other assets keep their own licenses.
