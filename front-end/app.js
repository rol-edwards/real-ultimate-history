const person = require('./pages/person_page.vue')
const event = require('./pages/event_page.vue')
const home = require('./pages/home.vue')
const add_person = require('./pages/add_person.vue')
const add_event = require('./pages/add_event.vue')
const edit_person = require('./pages/edit_person.vue')
const people_index = require('./pages/people_index.vue')
const events_index = require('./pages/events_index.vue')
const edit_event = require('./pages/edit_event.vue')
const login = require('./pages/login.vue')
//const sidebar = require('./pages/sidebar.vue')
//const Vue = require('vue');
//const VueRouter = require('vue-router');
//const vueify = require('vueify');

//Vue.use(VueRouter);

const router = new VueRouter ({
	routes: [
		{path: '/', component: home, props: true},
		{path: '/person/:id', component: person, props: true},
		{path: '/event/:id', component: event, props: true},
		{path: '/add_person', component: add_person, props: true},
		{path: '/add_event', component: add_event, props: true},
		{path: '/edit_person/:id', component: edit_person, props: true},
		{path: '/edit_event/:id', component: edit_event, props: true},
		{path: '/people_index', component: people_index, props: true},
		{path: '/events_index', component: events_index, props: true},
		{path: '/login', component: login, props: true},
		//{path: '*', redirect: '/'}
	]
});

const app = new Vue ({
	el: '#app',
	router: router,
	data: {
		people: 'Placeholder',
		loggedin: false,
		chosen_color: 'red',
		name: ''
	},
	
	methods: {

		logged_in: function(){
			this.loggedin = true;
		},
		
		deactivate_sidebar: function(){
	
			this.sidebar_toggle = !this.sidebar_toggle;
		
		},

		logout: function(){
			this.$http.get('api/logout').then(function(data){
				console.log('logout completed');
				this.$router.push('/');
				this.loggedin = false;

			})
		}
	},

	components: {

		//'login': login,
		//'sidebar': sidebar,
	}

})
