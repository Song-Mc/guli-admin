<template>
  <div style="padding:10px">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"/>

    <el-tree
      ref="tree2"
      :data="subjectNestedList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all/>
  </div>
</template>
<script>
import subjectApi from '@/api/subject'
export default {

  data() {
    return {
      filterText: '', // 表示过滤字符串，可以筛选树形图中的数据
      subjectNestedList: [],
      defaultProps: {
        children: 'children', // 解析节点的子节点集合使用哪个属性
        label: 'title' // 节点名称的属性名
      }
    }
  },
  watch: { // 监听方法
    filterText(val) { // 监听 vue的filterText属性值，一旦变化，此方法就会调用
      this.$refs.tree2.filter(val) // 从vue对象中获取它的tree2 (ref)组件，调用它的filter方法对树形图中的数据进行过滤
    }
  },
  created() {
    this.getSubjectNestedList()
  },
  methods: {
    getSubjectNestedList() {
      subjectApi.subjectNestedList().then(response => {
        this.subjectNestedList = response.data.items
      })
    },
    filterNode(value, data) { // 树形图的每个节点都会调用一次本方法
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 // 使用value(用户输入的查询内容) 和每个节点的label标题进行比较，如果返回true代表包含
    }
  }
}
</script>
