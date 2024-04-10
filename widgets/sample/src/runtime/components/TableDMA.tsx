import { React, ReactRedux, IMState, appActions } from "jimu-core";
import { MaterialReactTable, type MRT_Virtualizer } from "material-react-table";
import { ePage, eSelectedItem } from "../../../../common/sample";
import { Box, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const { useSelector } = ReactRedux;
const { useState, useRef, useEffect } = React;

const TableDMA = (props) => {
  const rowVirtualizerInstanceRef = useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);
  const { dispatch } = props;

  const pagination = useSelector((state: IMState) => state.widgetsState?.pagination?.paginationSection);
  const tableDMA = useSelector((state: IMState) => state.widgetsState?.dataDMA?.dataDMASection);
  const dataDMA = tableDMA?.map((el: any) => ({ maDMA: el.MADMA, nguoiQuanLy: el.NGUOIQUANLY || "__", ghiChu: el.GHICHU || "__", id: el.OBJECTID, tenMa: el.TENMA || "__", geometry: el.geometry }));

  //should be memoized or stable
  const columnsDMA = [
    { accessorKey: "id", header: "ID", size: 50 },
    { accessorKey: "maDMA", header: "Ma DMA", size: 150 },
    { accessorKey: "nguoiQuanLy", header: "Nguoi Quan Li", size: 150 },
    { accessorKey: "ghiChu", header: "Ghi Chu", size: 150 },
    { accessorKey: "tenMa", header: "Ten Ma", size: 150 },
  ];

  // internal state of table
  const [paginationInternal, setPaginationInternal] = useState({
    pageIndex: pagination?.pageIndex || 0,
    pageSize: pagination?.pageSize, //customize the default page size
  });

  useEffect(() => {
    if (!pagination) return;
    dispatch(appActions.widgetStatePropChange(ePage.storeKey, ePage.sectionKey, { pageIndex: paginationInternal.pageIndex, pageSize: paginationInternal.pageSize, total: pagination.total }));
  }, [paginationInternal.pageIndex, paginationInternal.pageSize]);

  function handleZoom(data) {
    dispatch(appActions.widgetStatePropChange(eSelectedItem.storeKey, eSelectedItem.sectionKey, data));
  }
  return (
    <MaterialReactTable
      columns={columnsDMA}
      data={dataDMA || []}
      enableRowVirtualization
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowCount={pagination?.total || 0}
      manualPagination
      onPaginationChange={setPaginationInternal}
      state={{
        pagination: paginationInternal,
        //isLoading: isRefetching,
        //showProgressBars: isRefetching,
        density: "compact",
      }}
      enableRowActions
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
          <IconButton color="primary" onClick={() => handleZoom(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Box>
      )}
    />
  );
};

export default TableDMA;
