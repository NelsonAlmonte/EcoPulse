<script lang="ts">
	let { data } = $props();

	console.log(data);
</script>

<h1>{data.issue.category.name}</h1>
