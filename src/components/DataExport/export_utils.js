export function handleExport(dt, tHeader, filterVal, multiHeader) {
  import('@/vendor/Export2Excel').then((excel) => {
    const data = formatJson(filterVal, dt);
    if (multiHeader) {
      excel.export_json_to_excel({
        header: tHeader,
        multiHeader: [multiHeader],
        data,
        filename: 'export-data',
      });
    } else {
      excel.export_json_to_excel({
        header: tHeader,
        data,
        filename: 'export-data',
      });
    }
  });
}

export function formatJson(filterVal, jsonData) {
  var x = jsonData.map((v) =>
    filterVal.map((j) => {
      return v[j];
    })
  );

  return x;
}
