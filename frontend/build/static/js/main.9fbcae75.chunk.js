(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[1],[,,,,,,,,,,,function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n(0),l=Object(a.createContext)({isLoggedIn:!1,userId:null,token:null,login:function(){},logout:function(){}})},,,,function(e,t,n){"use strict";var a=n(0),l=n.n(a);n(38);t.a=function(e){return l.a.createElement("div",{className:"".concat(e.asOverlay&&"loading-spinner__overlay")},l.a.createElement("div",{className:"lds-dual-ring"}))}},,,function(e,t,n){"use strict";var a=n(0),l=n.n(a),c=n(8),r=n.n(c);n(36);t.a=function(e){return r.a.createPortal(l.a.createElement("div",{className:"backdrop",onClick:e.onClick}),document.getElementById("backdrop-hook"))}},,,,function(e,t,n){e.exports=n(39)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a,l=n(0),c=n.n(l),r=n(8),u=n.n(r),o=(n(27),n(7)),i=n(9),m=n(6),s=(n(28),function(e){return c.a.createElement("header",{className:"main-header"},e.children)}),E=(n(29),n(11)),d=function(e){var t=Object(l.useContext)(E.a);return c.a.createElement("ul",{className:"nav-links"},c.a.createElement("li",null,c.a.createElement(m.c,{to:"/",exact:!0},"ALL USERS")),t.isLoggedIn&&c.a.createElement("li",null,c.a.createElement(m.c,{to:"/".concat(t.userId,"/places")},"MY PLACES")),t.isLoggedIn&&c.a.createElement("li",null,c.a.createElement(m.c,{to:"/places/new"},"ADD PLACE")),!t.isLoggedIn&&c.a.createElement("li",null,c.a.createElement(m.c,{to:"/auth"},"AUTHENTICATE")),t.isLoggedIn&&c.a.createElement("button",{onClick:t.logout},"LOGOUT"))},f=n(41),b=(n(35),function(e){var t=c.a.createElement(f.a,{in:e.show,timeout:200,classNames:"slide-in-left",mountOnEnter:!0,unmountOnExit:!0},c.a.createElement("aside",{className:"side-drawer",onClick:e.onClick},e.children));return u.a.createPortal(t,document.getElementById("drawer-hook"))}),g=n(18),p=(n(37),function(e){var t=Object(l.useState)(!1),n=Object(o.a)(t,2),a=n[0],r=n[1],u=function(){return r(!1)};return c.a.createElement(l.Fragment,null,a&&c.a.createElement(g.a,{onClick:u}),c.a.createElement(b,{show:a,onClick:u},c.a.createElement("nav",{className:"main-navigation__drawer-nav"},c.a.createElement(d,null))),c.a.createElement(s,null,c.a.createElement("button",{className:"main-navigation__menu-btn",onClick:function(){return r(!0)}},c.a.createElement("span",null),c.a.createElement("span",null),c.a.createElement("span",null)),c.a.createElement("h1",{className:"main-navigation__title"},c.a.createElement(m.b,{to:"/"},"YourPlaces")),c.a.createElement("nav",{className:"main-navigation__header-nav"},c.a.createElement(d,null))))}),v=n(15),h=c.a.lazy((function(){return Promise.all([n.e(0),n.e(8)]).then(n.bind(null,72))})),k=c.a.lazy((function(){return Promise.all([n.e(0),n.e(5)]).then(n.bind(null,69))})),O=c.a.lazy((function(){return Promise.all([n.e(0),n.e(7)]).then(n.bind(null,73))})),I=c.a.lazy((function(){return Promise.all([n.e(0),n.e(6)]).then(n.bind(null,70))})),j=c.a.lazy((function(){return Promise.all([n.e(0),n.e(4)]).then(n.bind(null,71))})),C=function(){var e,t=function(){var e=Object(l.useState)(null),t=Object(o.a)(e,2),n=t[0],c=t[1],r=Object(l.useState)(null),u=Object(o.a)(r,2),i=u[0],m=u[1],s=Object(l.useState)(!1),E=Object(o.a)(s,2),d=E[0],f=E[1],b=Object(l.useCallback)((function(e,t,n){c(t),f(e);var a=n||new Date((new Date).getTime()+36e5);m(a),localStorage.setItem("userData",JSON.stringify({userId:e,token:t,expiration:a.toISOString()}))}),[]),g=Object(l.useCallback)((function(){c(null),m(null),f(null),localStorage.removeItem("userData")}),[]);return Object(l.useEffect)((function(){n&&i?a=setTimeout(g,i.getTime()-(new Date).getTime()):clearTimeout(a)}),[n,g,i]),Object(l.useEffect)((function(){var e=JSON.parse(localStorage.getItem("userData"));e&&e.token&&new Date(e.expiration)>new Date&&b(e.userId,e.token)}),[b]),[n,b,g,d]}(),n=Object(o.a)(t,4),r=n[0],u=n[1],s=n[2],d=n[3];return e=r?c.a.createElement(i.d,null,c.a.createElement(i.b,{path:"/",exact:!0},c.a.createElement(h,null)),c.a.createElement(i.b,{path:"/:userId/places",exact:!0},c.a.createElement(O,null)),c.a.createElement(i.b,{path:"/places/new",exact:!0},c.a.createElement(k,null)),c.a.createElement(i.b,{path:"/places/:placeId"},c.a.createElement(I,null)),c.a.createElement(i.a,{to:"/"})):c.a.createElement(i.d,null,c.a.createElement(i.b,{path:"/",exact:!0},c.a.createElement(h,null)),c.a.createElement(i.b,{path:"/:userId/places",exact:!0},c.a.createElement(O,null)),c.a.createElement(i.b,{path:"/auth"},c.a.createElement(j,null)),c.a.createElement(i.a,{to:"/auth"})),c.a.createElement(E.a.Provider,{value:{isLoggedIn:!!r,token:r,userId:d,login:u,logout:s}},c.a.createElement(m.a,null,c.a.createElement(p,null),c.a.createElement("main",null,c.a.createElement(l.Suspense,{fallback:c.a.createElement("div",{className:"center"},c.a.createElement(v.a,null))},e))))};u.a.render(c.a.createElement(C,null),document.getElementById("root"))}],[[22,2,3]]]);
//# sourceMappingURL=main.9fbcae75.chunk.js.map