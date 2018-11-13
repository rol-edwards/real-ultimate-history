<template>
	<div>
		<h1>Tutorial</h1>
		<p>Real, Ultimate History is a <span class='hyperbole'>history wiki</span>, with pages giving information on historical people and historical events. To see if a person or event has a page on this site, either use the search function on the top banner, or go to the people or events indexes on the side menu.</p>
		<p>If you would like to become a contributor to the site, you can create an account by <a v-bind:href="'/#/login'">signing up</a>. You will then be able to add new pages or edit existing ones.</p>
		<h2>Adding a person</h2>
		<ol>
			<li>Click the link <a v-bind:href="'/#/add_person'">here</a>, on the home page or the people index page to get the add person form.</li>
			<li>Fill in the details for the person. Be careful to select the correct era for dates! You will receive a warning if the date of birth is after the date of death, or if the person's age, based on your input, is below 10 or over 120.</li>
			<li>If there is already a page for a person with that name, or a person with an identical lifespan, you will be asked to confirm that you are not adding a duplicate.</li>
			<li>If this wiki has pages for events that occurred within the lifespan you have specified, you will be given the option to link any relevant events to the person (please only choose events that involved the person!) You can then enter the person's role in the event.</li>
			<li>Finally, you can upload an image of the person from your computer.</li>
		</ol>
		<h2>Editing a person</h2>
		<ol>
			<li>Click on the 'pen' icon on that person's page</li>
			<li>From then on, the process is the same as for adding a person.</li>
		</ol>

		<h2>Adding/editing events</h2>
			<p>The process is the same as for people. After you have submitted the date of the event, you will get a checklist of people alive on that date, and can create links with any people involved in the event, and specify their role.</p>

		<h2>Deleting people/events</h2>
			<p>Click on the 'dustbin' icon on the page, and confirm that you want to delete. This cannot be reversed, so please be careful</p>
	</div>
</template>