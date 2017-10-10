export default {
  methods: {
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

    slugify(modelName) {
      let model = modelName.toLowerCase().replace(/ /g, '-');
      model = model.replace(/[^a-z_-]/, '');
      model = model.replace(/-{2,}/g, '-');
      return model;
    },
  },
};
