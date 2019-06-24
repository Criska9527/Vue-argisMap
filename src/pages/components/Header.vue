<template>
  <div>
      <div class="header">
          <img class="header-img" src="/static/images/logo.png" alt="">
          ArcGis For Vue
      </div>
  </div>
</template>
<script>
export default {
  name: "HomeHeader",
 
};
</script>
<style lang="stylus" scoped>
    .header
        background: linear-gradient(left, #00e7ff , blue)
        font-size:.8rem
        color:#fff
        padding:.14rem 0
        .header-img
            max-width: 1.04rem
            vertical-align:bottom
            
</style>