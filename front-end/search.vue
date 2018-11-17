<template>
	<div>
		
			<label for='search_option'>Search for:</label>
			<select id='search_option' v-model='search_option'>
				<option value='person'>People</option>
				<option value='event'>Events</option>
			</select>
			<input v-model='search_term' v-on:input='search(search_option)' id='search' autocomplete='off'>
			<div v-if='!input_empty' class='dropdown-content'>
				<div v-for='r in search_results' >
					<p><a v-bind:href="'/#/' + search_option + '/' + r.id" v-on:click='clearSearch'>{{r.name}}</a></p>
				</div>
			</div>
			
	</div>
</template>