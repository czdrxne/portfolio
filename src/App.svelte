<script lang="ts">
  
  import Preloader 			from "@components/Preloader.svelte";
  import Header 				from "@components/Header.svelte";

  import Home 					from "@routes/Home.svelte";
  
  let showPreloader: boolean = true;

</script>

<Preloader
  bind:showPreloader
  on:done={() => showPreloader = false}
/>
<div>
	<Header />
	<main class="relative h-svh w-svw bg-blk-pri cursor-default overflow-hidden selection:bg-blu-pri selection:text-wht-pri">
  	<Home />
	</main>
</div>