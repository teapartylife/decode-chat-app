<template>
  <v-container class="h-full">
    <!-- Header -->
    <div class="text-center mt-3" data-aos="fade-up">
      <h1 class="font-mono text-4xl md:text-6xl mb-2 max-w-5xl mx-auto">
        About this project.
      </h1>
    </div>

    <!-- Content -->
    <section
      data-aos="fade-up"
      data-aos-delay="300"
      class="text-center mt-24 text-lg mx-auto"
    >
      <p>
        This is a side project by 🐼
        <a
          href="https://twitter.com/0xsilkroad"
          target="_blank"
          rel="noopener noreferrer"
          >@0xsilkroad</a
        >
        from 🍵
        <a
          href="https://twitter.com/teapartylife"
          target="_blank"
          rel="noopener noreferrer"
          >TeaParty.life</a
        >
        .
      </p>
      <p>
        I created this project because there is no other simple way for me to
        <u>send messages to an EVM wallet address</u>.
      </p>
      <p>
        This project will be <u>open-source soon</u>, so if you feel this
        project don't meet your requirement, feel free to contribute or fork it
        and make a new one.
      </p>
    </section>

    <section
      data-aos="fade-up"
      data-aos-offset="-200"
      data-aos-delay="600"
      class="text-center mt-24 text-lg mx-auto"
    >
      <h2 class="font-mono text-4xl mb-8 max-w-5xl mx-auto">Tech explained.</h2>
      <p>• Backend is done in a hybrid way: on-chain &amp; off-chain</p>
      <p>
        • Messages encryption and access control are done using 🔥
        <a
          href="https://litprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
          >Lit Protocol</a
        >
      </p>
      <p>
        •
        <a
          href="https://litprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
          >Lens Protocol</a
        >
        🌿 coming soon
      </p>
    </section>

    <section
      data-aos="fade-up"
      data-aos-offset="-300"
      data-aos-delay="900"
      class="text-center mt-24 text-lg mx-auto mb-24"
    >
      <h2 class="font-mono text-4xl mb-8 max-w-5xl mx-auto">Roadmap ahead.</h2>
      <p>
        • Support on-page notification for better visibility on new incoming
        messages
      </p>
      <p>• Integrate emoji</p>
      <p>• Enabling iframe, so other websites can use this badass</p>
      <p>
        • Integrate
        <a
          href="https://litprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
          >Lens Protocol</a
        >
        🌿 and bring in profiles
      </p>
    </section>
  </v-container>
</template>

<script>
export default {
  name: 'AboutPage',
  head() {
    return {
      title: `decode.chat — about`,
    };
  },
};
</script>
