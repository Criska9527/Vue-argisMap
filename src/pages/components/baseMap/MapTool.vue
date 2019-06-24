<template>
  <div>
    <div class="tool-content">
        <div class="tool-bar">
            <ul>
                <li></li>
            </ul>
        </div>
        <div class="tool-pos">
            
        </div>
    </div>
  </div>
</template>
<script>
import { loadModules } from 'esri-loader';
export default {
  name: "MapTool",
 
};
</script>
<style lang="stylus" scoped>
.tool-content
  position: absolute;
  bottom: 0.32rem;
  left: 0.2rem;
  font-size: 0.28rem;
  background: rgba(0, 132, 255, 0.8);
  text-align: center;
  border-radius: 0.24rem;
  color: #fff;
  cursor: pointer;
</style>


