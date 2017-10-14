<template>
  <div class="warning">
    <h1>Warning</h1>
    <p class="subtitle">For mature audiences only. This site deals with bondage, fetish and fashion fantasies. All content was produced in a highly consentual, professional, and safe environment.</p>

    <div class="actions">
      <button @click="enter" class="large two-lines">
        <span>Continue</span>
        <small>I understand, and I am an adult</small>
      </button>

      <a role="button" href="https://www.google.com" class="secondary two-lines">
        <span>Take me elsewhere</span>
        <small>This isn't for me</small>
      </a>
    </div>

    <aside>
      <p>We are committed to the prevention of viewing adult content by minor. Visit these resources for more information:<br>
      <a href="http://www.asacp.com/" target="_blank">ASACP</a> | <a href="http://www.fosi.org/" target="_blank">FOSI</a> | <a href="http://www.safesurf.com/" target="_blank">Safe Surf Rated</a> | <a href="http://www.netnanny.com/" target="_blank">Net Nanny</a> | <a href="http://www.nspcc.org.uk/help-and-advice/for-parents/online-safety/online-safety_wdh99554.html" target="_blank">NSPCC</a></p>

      <p>All models appearing on Limited Audience were 18 years or older at the time of photography.<br>
      <a href="http://www.limitedaudience.com/usc2257">U.S.C. 2257 Compliance Statement</a></p>
		</aside>
  </div>
</template>

<script>
  export default {
    methods: {
      enter() {
        const date = new Date();
        date.setTime(date.getTime() + (14 * 24 * 60 * 60 * 1000)); // 2 weeks

        // eslint-disable-next-line prefer-template
        document.cookie = encodeURIComponent('la5warning') + '=1; expires=' + date.toUTCString();

        window.hideModal();
      },
    },
  };
</script>
