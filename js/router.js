class Router {
  routes = [];
  mode = null;
  root = '/';

  constructor(options) {
    this.mode = window.history.pushState ? 'history' : 'hash';
    if (options.mode) this.mode = options.mode;
    if (options.root) this.root = options.root;

    console.log(`Router mode is ${this.mode}`);
  }

  add = (path, cb, page) => {
    this.routes.push({ path, cb, page });
    return this;
  };

  remove = path => {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i].path === path) {
        this.routes.slice(i, 1);
        return this;
      }
    }
    return this;
  };

  flush = () => {
    this.routes = [];
    return this;
  };

  clearSlashes = path =>
    path
      .toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');

  getPath = () => {
    let fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  };

  navigate = (path = '') => {
    if (this.mode === 'history') {
      window.history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
    }
    return this;
  };

  follow = async () => {
    if (this.current === this.getPath()) return;
    this.current = this.getPath();

    let theRoute = null;
    this.routes.some(route => {
      const match = this.current.match(route.path);
      if (match) {
        theRoute = route;
        match.shift();
        route.cb.apply({}, match);
        return match;
      }
      return false;
    });
    if(theRoute && theRoute.page) {
      let response = await fetch(theRoute.page);
      let content = await response.text();
      let element = document.getElementById('root');
      element.innerHTML = content;
    }
  };


}

export default Router;

