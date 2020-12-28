import Router from './router.js';

export const router = new Router({
  mode: 'hash',
  root: '/'
});

router
  .add(/about/, () => {
    console.log('Welcome in about page');
  }, 'about.html')
  .add(/contact/, () => {
    console.log('Welcome in contact page');
  }, 'contact.html')
  .add(/products\/(.*)\/specification\/(.*)/, (id, specification) => {
    console.log(`products: ${id} specification: ${specification}`);
  }, 'products.html')
  .add('', () => {
    // general controller
    console.log('Welcome in catch all controller');
  }, 'home.html');

window.onpopstate = function(event) {
  console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
  router.follow();
};

globalThis.router = router;


  

