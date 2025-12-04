// Vue 应用实例
new Vue({
  el: '#app',
  data() {
    return {
      // 原始数据
      sourceData: {
        excelName: 'IPO数据',
        sheetList: [
          {
            sheetName: ' 5-1应收账款-按种类 ',
            cells: ['E4 ', 'F4 ', 'G4 ', 'H5 ', 'L5 ', 'M5 '],
            errorType: '数据类型错误',
          },
          {
            sheetName: ' 6-应收账款-期末余额前几名单位情况 ',
            cells: ['C5 ', 'D5 ', 'E5 ', 'F5 '],
            errorType: '数据类型错误',
          },
          {
            sheetName: ' 8-应收票据-期末已背书或贴现但尚未到期 ',
            cells: ['B5 ', 'C5 ', 'D5 ', 'E5 ', 'F5 ', 'G5 ', 'H5 ', 'I5 '],
            errorType: '数据类型错误',
          },
        ],
      },
      exporting: false, // 导出状态
    }
  },
  computed: {
    /**
     * 格式化后的 JSON 数据（用于预览）
     */
    formattedJsonData() {
      return JSON.stringify(this.sourceData, null, 2)
    },

    /**
     * 转换后的表格数据
     * 将 cells 数组用中文逗号连接
     */
    tableData() {
      return this.sourceData.sheetList.map((item) => ({
        sheetName: item.sheetName.trim(),
        errorType: item.errorType,
        cellCoordinates: item.cells.map((cell) => cell.trim()).join('，'),
      }))
    },
  },
  methods: {
    /**
     * 导出为 Excel 文件
     */
    exportToExcel() {
      if (this.sourceData.sheetList.length === 0) {
        this.$message.warning('没有数据可以导出！')
        return
      }

      try {
        this.exporting = true

        // 准备导出数据
        const exportData = this.tableData.map((item) => ({
          表格名称: item.sheetName,
          错误类型: item.errorType,
          错误的单元格坐标: item.cellCoordinates,
        }))

        // 创建工作表
        const worksheet = XLSX.utils.json_to_sheet(exportData)

        // 设置列宽
        worksheet['!cols'] = [
          { wch: 45 }, // 表格名称列
          { wch: 15 }, // 错误类型列
          { wch: 50 }, // 错误的单元格坐标列
        ]

        // 创建工作簿
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, '错误报告')

        // 导出文件，文件名取 excelName 字段
        const fileName = `${this.sourceData.excelName}.xlsx`
        XLSX.writeFile(workbook, fileName)

        this.$message.success(`Excel 文件「${fileName}」导出成功！`)
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败，请检查浏览器控制台查看详细错误！')
      } finally {
        this.exporting = false
      }
    },
  },
})
