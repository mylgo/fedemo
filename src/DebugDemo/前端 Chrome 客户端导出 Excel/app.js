// Vue 应用实例
new Vue({
  el: '#app',
  data() {
    return {
      // 错误数据列表
      errorData: [
        {
          index: 1,
          tableName: '资产负债表',
          errorType: '数据类型错误',
          cellCoordinates: 'C6,D6,E6,F6',
        },
        {
          index: 2,
          tableName: '利润表',
          errorType: '数据类型错误',
          cellCoordinates: 'C10,D10',
        },
        {
          index: 3,
          tableName: '现金流量表',
          errorType: '数据类型错误',
          cellCoordinates: 'C20',
        },
        {
          index: 4,
          tableName: '资产负债表',
          errorType: '公式计算错误',
          cellCoordinates: 'G15,G16',
        },
        {
          index: 5,
          tableName: '利润表',
          errorType: '格式不正确',
          cellCoordinates: 'E5,F5,G5',
        },
      ],
      exporting: false, // 导出状态
    }
  },
  methods: {
    /**
     * 导出为 Excel 文件
     */
    exportToExcel() {
      if (this.errorData.length === 0) {
        this.$message.warning('没有数据可以导出！')
        return
      }

      try {
        this.exporting = true

        // 准备导出数据
        const exportData = this.errorData.map((item) => ({
          表格名称: item.tableName,
          错误类型: item.errorType,
          错误的单元格坐标: item.cellCoordinates,
        }))

        // 创建工作表
        const worksheet = XLSX.utils.json_to_sheet(exportData)

        // 设置列宽
        worksheet['!cols'] = [
          { wch: 10 }, // 序号列
          { wch: 20 }, // 表格名称列
          { wch: 20 }, // 错误类型列
          { wch: 40 }, // 错误的单元格坐标列
        ]

        // 创建工作簿
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, '错误报告')

        // 导出文件
        XLSX.writeFile(workbook, '错误报告.xlsx')

        this.$message.success('Excel 文件导出成功！')
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败，请检查浏览器控制台查看详细错误！')
      } finally {
        this.exporting = false
      }
    },

    /**
     * 添加新的错误记录
     */
    addErrorRow() {
      this.$prompt('请输入表格名称', '添加错误记录', {
        confirmButtonText: '下一步',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '表格名称不能为空',
      })
        .then(({ value: tableName }) => {
          // 获取错误类型
          return this.$prompt('请输入错误类型', '添加错误记录', {
            confirmButtonText: '下一步',
            cancelButtonText: '取消',
            inputPattern: /.+/,
            inputErrorMessage: '错误类型不能为空',
            inputValue: '数据类型错误',
          }).then(({ value: errorType }) => {
            // 获取单元格坐标
            return this.$prompt('请输入错误的单元格坐标（用逗号分隔）', '添加错误记录', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /.+/,
              inputErrorMessage: '单元格坐标不能为空',
              inputValue: 'A1,B1',
            }).then(({ value: cellCoordinates }) => {
              // 添加新记录
              const newIndex = this.errorData.length > 0 ? Math.max(...this.errorData.map((item) => item.index)) + 1 : 1

              this.errorData.push({
                index: newIndex,
                tableName: tableName,
                errorType: errorType,
                cellCoordinates: cellCoordinates,
              })

              this.$message.success('添加成功！')
            })
          })
        })
        .catch(() => {
          // 用户取消操作
        })
    },

    /**
     * 删除指定行
     */
    deleteRow(index) {
      this.$confirm('确定要删除这条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.errorData.splice(index, 1)
          // 重新计算序号
          this.errorData.forEach((item, idx) => {
            item.index = idx + 1
          })
          this.$message.success('删除成功！')
        })
        .catch(() => {
          // 用户取消操作
        })
    },

    /**
     * 重置为默认测试数据
     */
    resetData() {
      this.$confirm('确定要重置为默认测试数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.errorData = [
            {
              index: 1,
              tableName: '资产负债表',
              errorType: '数据类型错误',
              cellCoordinates: 'C6,D6,E6,F6',
            },
            {
              index: 2,
              tableName: '利润表',
              errorType: '数据类型错误',
              cellCoordinates: 'C10,D10',
            },
            {
              index: 3,
              tableName: '现金流量表',
              errorType: '数据类型错误',
              cellCoordinates: 'C20',
            },
            {
              index: 4,
              tableName: '资产负债表',
              errorType: '公式计算错误',
              cellCoordinates: 'G15,G16',
            },
            {
              index: 5,
              tableName: '利润表',
              errorType: '格式不正确',
              cellCoordinates: 'E5,F5,G5',
            },
          ]
          this.$message.success('数据已重置！')
        })
        .catch(() => {
          // 用户取消操作
        })
    },
  },
  mounted() {
    console.log('Vue 应用已加载')
    console.log('当前错误数据条数:', this.errorData.length)
  },
})
