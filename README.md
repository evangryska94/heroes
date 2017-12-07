# Angular4 Testing
### Tour of Heroes

### Tips
 - To trigger button clicks:
  - If the selected element is type `HtmlElement` you can trigger the click with `element.click()`
  - If the selected element is type `DebugElement` you can trigger a left mouse button click with `element.triggerEventHandler('click', { button: 0 })`
 - Access private variables on a component or service through the TestBed using `TestBed.get({ClassName})`
 - Angular Router has changed in Angular4 in the way you access parameters
 - Make sure to grab an element on the page after everything has been set up. Grabbing buttons before all spys are set up can have unexpected behavior!