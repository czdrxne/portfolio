<script lang="ts">
  import { onMount, tick, createEventDispatcher } from "svelte";

  export let showPreloader: boolean = true;

  const dispatch = createEventDispatcher<{ done: void }>();

  let container: HTMLDivElement | null = null;
  let bars: NodeListOf<HTMLDivElement> = [] as unknown as NodeListOf<HTMLDivElement>;

  let scrollY: number = 0;
  let barsCount: number = 10;
  let animateStatus: boolean = false;

  let gsap: typeof import("gsap") | null = null;
  let timeline: GSAPTimeline | null = null;

  onMount(async () => {
    const gsapModule = await import("gsap");
    gsap = gsapModule.default;

    const mq = window.matchMedia("(max-width: 640px)");

    const update = async () => {
      barsCount = mq.matches ? 5 : 10;
      await tick();

      if (container) {
        bars = container.querySelectorAll<HTMLDivElement>(".preloader-bar");
        buildTimeline();
      }
    };

    await update();
    mq.addEventListener("change", update);
  });

  function buildTimeline(): void {
    if (!gsap) return;

    if (timeline) timeline.kill();

    timeline = gsap.timeline({
      paused: true,
      delay: 0.3,
      defaults: { ease: "power2.out" }
    });

    // Animate logo letters
    timeline.fromTo(
      ".logo span",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.15,
        stagger: 0.03
      }
    );

    timeline.to({}, { duration: 0.5 });

    timeline.to(".logo span", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    if (bars.length) {
      timeline.to(bars, {
        y: "100%",
        duration: 1,
        stagger: 0.07
      });
    }
  }

  // Play timeline when showPreloader is true
  $: if (timeline && showPreloader) {
    animateStatus = true;
    timeline.play(0);
    timeline.eventCallback("onComplete", () => {
      animateStatus = false;
      dispatch("done");
    });
  }

  // Lock scroll while preloader is active
  $: {
    if (showPreloader || animateStatus) {
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
  }
</script>

<div
  bind:this={container}
  class={`preloader fixed inset-0 z-[1000] cursor-default select-none
  ${showPreloader || animateStatus ? "block" : "hidden"}`}
>
  <div class="fixed flex inset-0">
    {#each Array(barsCount) as _}
      <div class="preloader-bar bg-wht-full h-full w-full translate-y-0"></div>
    {/each}

    <p class="logo flex text-[5rem] sm:text-[25vw] lg:text-[16vw] sm:gap-1 font-primary
      text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      leading-none overflow-hidden tracking-tight text-blk-full"
    >
      {#each "CZDRXNE".split("") as letter}
        <span class="logo-letter inline-block translate-y-full opacity-0">
          {letter}
        </span>
      {/each}
    </p>
  </div>
</div>