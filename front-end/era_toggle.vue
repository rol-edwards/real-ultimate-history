<template>
	<div>
		<tr v-if='dod.era=="BC"'>
			<td>Date of birth</td>
			<td><input type='text' id='dob' v-model='dob.number'></input></td>
			<td>BC</td>
			<td v-show='empty_dob' class='empty'>Required field</td>
		</tr>
		<tr v-else>
			<td>Date of birth</td>
			<td><input type='text' id='dob' v-model='dob.number'></input></td>
			<td><input type='radio' v-model='dob.era' value='BC' id='BC' >BC</input>
				<input type='radio' v-model='dob.era' value='AD' id='AD' >AD</input></td>
			<td v-show='empty_dob' class='empty'>Required field</td>
		</tr>
	</div>
</template>

<script>

module.exports = {
	
			name: "eraToggle",
	props: ['dob', 'dod'],
	data: function() {
		return {
		}
	}
	
}

</script>