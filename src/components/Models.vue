<template>
  <div class="models">
    <ul>
      <li v-for="model in models" :key="model.name">
        <a href="#"><span>{{ model.name }}</span></a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pictureWidth: 156,
        pictureHeight: 156,
        models: [
          {
            name: 'Eve',
            picX: 0,
            picY: 0,
          },
          {
            name: 'Kittysocks',
            picX: 156,
            picY: 0,
          },
          {
            name: 'Alais Peach',
            picX: 312,
            picY: 0,
          },
          {
            name: 'Anastasia',
            picX: 468,
            picY: 0,
          },
          {
            name: 'Freya',
            picX: 624,
            picY: 0,
          },
          {
            name: 'Jewell Marceau',
            picX: 780,
            picY: 0,
          },
          {
            name: 'Fayth on Fire',
            picX: 936,
            picY: 0,
          },
          {
            name: 'AltSiren',
            picX: 1092,
            picY: 0,
          },
          {
            name: 'Ammalia',
            picX: 1248,
            picY: 0,
          },
          {
            name: 'Caroline Pierce',
            picX: 1404,
            picY: 0,
          },
          {
            name: 'Fay',
            picX: 0,
            picY: 312,
          },
          {
            name: 'Trisha',
            picX: 156,
            picY: 312,
          },
          {
            name: 'Bryony Fuller',
            picX: 312,
            picY: 312,
          },
          {
            name: 'Kimmy Louise',
            picX: 468,
            picY: 312,
          },
          {
            name: 'Nyxon',
            picX: 624,
            picY: 312,
          },
          {
            name: 'Melodii',
            picX: 780,
            picY: 312,
          },
          {
            name: 'Dynamo',
            picX: 936,
            picY: 312,
          },
          {
            name: 'Stacey Von',
            picX: 1092,
            picY: 312,
          },
          {
            name: 'Andrea Rosu',
            picX: 1248,
            picY: 312,
          },
          {
            name: 'Demi-Jay',
            picX: 1404,
            picY: 312,
          },
          {
            name: 'Six',
            picX: 0,
            picY: 624,
          },
          {
            name: 'Lexy',
            picX: 156,
            picY: 624,
          },
          {
            name: 'Syrah Lee',
            picX: 312,
            picY: 624,
          },
          {
            name: 'Loltaru',
            picX: 468,
            picY: 624,
          },
          {
            name: 'Kayla',
            picX: 624,
            picY: 624,
          },
          {
            name: 'Carmina',
            picX: 780,
            picY: 624,
          },
          {
            name: 'Violet Reign',
            picX: 936,
            picY: 624,
          },
          {
            name: 'Beckykat',
            picX: 1092,
            picY: 624,
          },
          {
            name: 'Luisa',
            picX: 1248,
            picY: 624,
          },
          {
            name: 'JenVy',
            picX: 1404,
            picY: 624,
          },
          {
            name: 'Peaches',
            picX: 0,
            picY: 936,
          },
          {
            name: 'Madison Rouge',
            picX: 156,
            picY: 936,
          },
          {
            name: 'Nikki',
            picX: 312,
            picY: 936,
          },
          {
            name: 'Lolly',
            picX: 468,
            picY: 936,
          },
          {
            name: 'Shrinking Violet',
            picX: 624,
            picY: 936,
          },
          {
            name: 'Lex Eleven',
            picX: 780,
            picY: 936,
          },
          {
            name: 'Livia',
            picX: 936,
            picY: 936,
          },
          {
            name: 'Ellie West',
            picX: 1092,
            picY: 936,
          },
          {
            name: 'AndromedaX',
            picX: 1248,
            picY: 936,
          },
          {
            name: 'Veriddian',
            picX: 1404,
            picY: 936,
          },
          {
            name: 'Tarda',
            picX: 0,
            picY: 1248,
          },
          {
            name: 'Victoria May',
            picX: 312,
            picY: 1248,
          },
          {
            name: 'Tulaine',
            picX: 468,
            picY: 1248,
          },
          {
            name: 'Truth',
            picX: 624,
            picY: 1248,
          },
          {
            name: 'Starchild',
            picX: 780,
            picY: 1248,
          },
          {
            name: 'Scarlett',
            picX: 936,
            picY: 1248,
          },
          {
            name: 'Sammie B',
            picX: 1092,
            picY: 1248,
          },
          {
            name: 'Rosaleen',
            picX: 1248,
            picY: 1248,
          },
          {
            name: 'Rebekka Raynor',
            picX: 1404,
            picY: 1248,
          },
          {
            name: 'Raevan',
            picX: 0,
            picY: 1560,
          },
          {
            name: 'Pepsi',
            picX: 156,
            picY: 1560,
          },
          {
            name: 'Nattsuko',
            picX: 312,
            picY: 1560,
          },
          {
            name: 'Morrigan',
            picX: 468,
            picY: 1560,
          },
          {
            name: 'Mellie D',
            picX: 624,
            picY: 1560,
          },
          {
            name: 'Luka',
            picX: 780,
            picY: 1560,
          },
          {
            name: 'Lexx',
            picX: 936,
            picY: 1560,
          },
          {
            name: 'Lazuli',
            picX: 1092,
            picY: 1560,
          },
          {
            name: 'Kyote',
            picX: 1248,
            picY: 1560,
          },
          {
            name: 'Kore',
            picX: 1404,
            picY: 1560,
          },
          {
            name: 'Kelly',
            picX: 0,
            picY: 1872,
          },
          {
            name: 'Katty',
            picX: 156,
            picY: 1872,
          },
          {
            name: 'Jewels',
            picX: 312,
            picY: 1872,
          },
          {
            name: 'Jasmine de Launay',
            picX: 468,
            picY: 1872,
          },
          {
            name: 'Ivy Leaf',
            picX: 624,
            picY: 1872,
          },
          {
            name: 'Ivy',
            picX: 780,
            picY: 1872,
          },
          {
            name: 'Ivory',
            picX: 936,
            picY: 1872,
          },
          {
            name: 'Hera',
            picX: 1092,
            picY: 1872,
          },
          {
            name: 'Halo',
            picX: 1248,
            picY: 1872,
          },
          {
            name: 'Gestalta',
            picX: 1404,
            picY: 1872,
          },
          {
            name: 'Erin',
            picX: 0,
            picY: 2184,
          },
          {
            name: 'Erica',
            picX: 156,
            picY: 2184,
          },
          {
            name: 'Elyssia',
            picX: 312,
            picY: 2184,
          },
          {
            name: 'Elle',
            picX: 468,
            picY: 2184,
          },
          {
            name: 'Elladee',
            picX: 624,
            picY: 2184,
          },
          {
            name: 'Elizabeth',
            picX: 780,
            picY: 2184,
          },
          {
            name: 'Elena',
            picX: 936,
            picY: 2184,
          },
          {
            name: 'Eclipse',
            picX: 1092,
            picY: 2184,
          },
          {
            name: 'Ebony',
            picX: 1248,
            picY: 2184,
          },
          {
            name: 'Dominick',
            picX: 1404,
            picY: 2184,
          },
          {
            name: 'Delphine',
            picX: 0,
            picY: 2496,
          },
          {
            name: 'Deception',
            picX: 156,
            picY: 2496,
          },
          {
            name: 'Chastity',
            picX: 312,
            picY: 2496,
          },
          {
            name: 'Cerulean',
            picX: 468,
            picY: 2496,
          },
          {
            name: 'Catya',
            picX: 624,
            picY: 2496,
          },
          {
            name: 'Brede',
            picX: 780,
            picY: 2496,
          },
          {
            name: 'Blossom Blois',
            picX: 936,
            picY: 2496,
          },
          {
            name: 'Sapphire',
            picX: 1092,
            picY: 2496,
          },
          {
            name: 'B',
            picX: 1248,
            picY: 2496,
          },
          {
            name: 'Azzriel',
            picX: 1404,
            picY: 2496,
          },
          {
            name: 'Auraylia',
            picX: 0,
            picY: 2808,
          },
          {
            name: 'Assisted Suicide',
            picX: 156,
            picY: 2808,
          },
          {
            name: 'Asphyxia',
            picX: 312,
            picY: 2808,
          },
          {
            name: 'Ariel',
            picX: 468,
            picY: 2808,
          },
          {
            name: 'Araminta',
            picX: 624,
            picY: 2808,
          },
          {
            name: 'Abigail',
            picX: 780,
            picY: 2808,
          },
        ],
      };
    },
  };
</script>