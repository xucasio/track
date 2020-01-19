<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  }
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow   : inset 0 0 5px rgba(1, 35, 54, 0.2);
  background   : #535353;
  }
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(1, 35, 54, 0.2);
  border-radius: 10px;
  background   : #ededed;
  }
</style>
