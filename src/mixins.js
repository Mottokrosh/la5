export default {
  methods: {
    showVideo(video) {
      this.$set(video, 'active', true);
      document.body.classList.add('frozen');
      document.onkeydown = (evt) => {
        const event = evt || window.event;
        if (event.keyCode === 27) {
          this.hideVideo(video);
        }
      };
    },

    hideVideo(video) {
      this.$set(video, 'active', false);
      document.body.classList.remove('frozen');
      document.onkeydown = null;
    },

    formatModels(models) {
      let formatted = [];
      models.forEach((m) => {
        let f = m;
        f = f.replace('-', ' ');
        f = f.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1));
        formatted.push(f);
      });
      formatted = formatted.join(', ');
      formatted = formatted.replace(/,([^,]*)$/, ' & $1');
      return formatted;
    },
  },
};
