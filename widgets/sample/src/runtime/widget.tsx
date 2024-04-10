import { DataSourceManager, React, type AllWidgetProps, ReactRedux, IMState, DataSource, FeatureLayerDataSource, DataSourceComponent, appActions, getAppStore } from "jimu-core";
import { type IMConfig } from "../config";
import { interval, mapWidgetId, pageSize } from "../../../common/constants";
import { MapViewManager } from "jimu-arcgis";
import { getJimuMapView, projectPointGeometryPolygon, mergeGeometry } from "../../../common/functions-map";
import { eDataDMA, ePage } from "../../../common/sample";
import { retrieveDataInProxy } from "../../../common/functions-map";
import TableDMA from "./components/TableDMA";
import { IPolygon } from "@esri/arcgis-rest-types";
const { useEffect, useState, useRef } = React;
const { useSelector } = ReactRedux;
const ProjectGeocodeURL = "https://cloud.intelli.com.vn/server/rest/services/Utilities/Geometry/GeometryServer/project";

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const highlightHandler = useRef(null);
  // Dùng để access map
  const { current: _viewManager } = useRef(MapViewManager.getInstance());

  // State of the data source
  const [isDataSourcesReady, setIsDataSourcesReady] = useState(false);
  const [isRefetching, setIsRefetching] = useState(true);

  // Get the app token
  const appToken = useSelector((state: IMState) => state.token);

  // get pagination
  const pagination = useSelector((state: IMState) => state.widgetsState?.pagination?.paginationSection);

  // get selected Item on table
  const selectedItem = useSelector((state: IMState) => state.widgetsState?.selected?.selectedSection);

  // Get the data source boilerplate
  let timeout = null as any;
  function getDs() {
    const dsArr: DataSource[] = [];

    props.useDataSources?.forEach((useDataSource) => {
      const ds = DataSourceManager.getInstance().getDataSource(useDataSource?.dataSourceId);
      dsArr.push(ds);
    });

    if (dsArr.every((ds) => ds)) {
      // example save index 0 of array
      /**
     *   
      Sau khi app ready mới bắt đầu sử dụng các DataSource
      Sử dụng bằng cách ds = DataSourceManager.getInstance().getDataSource(
        useDataSource?.dataSourceId
      );
      Hoặc dùng useRef để lưu lại dataSource
      Một widget có thể có nhiều dataSource
      Cần note lại index của dataSource trong mảng useDataSources để không bị nhầm lẫn query hay edit nhầm
     * 
    */

      setIsDataSourcesReady(true);
      clearTimeout(timeout);
    } else {
      setTimeout(() => getDs(), interval);
    }
  }

  // query data source includes geopmetry
  function queryDataSource() {
    const { dispatch } = props;
    const ds = DataSourceManager.getInstance().getDataSource(props.useDataSources[0]?.dataSourceId) as FeatureLayerDataSource;

    setIsRefetching(true);

    // query sample
    ds?.query({
      where: "1=1",
      outFields: ["*"],
      returnGeometry: true,
      page: pagination?.pageIndex + 1 || 1,
      pageSize: pageSize,
    }).then((data) => {
      const dataTable = data.records.map((_, index) => ({ ...retrieveDataInProxy(data.records[index]), geometry: _.getGeometry() }));

      // store in redux
      dispatch(appActions.widgetStatePropChange(eDataDMA.storeKey, eDataDMA.sectionKey, dataTable));
      setIsRefetching(false);
    });

    // query sample cho data từ URL
    const dsURL = DataSourceManager.getInstance().getDataSource(props.useDataSources[0]?.dataSourceId) as FeatureLayerDataSource;

    // query data từ loại Datasource này có thể trả về proxy object
    const loadedDsURL = dsURL?.createJSAPILayerByDataSource();

    // get layer definition sample
    const definition = ds?.getLayerDefinition();
  }

  // query total of data
  function queryPaginationCount() {
    const { dispatch } = props;
    const ds = DataSourceManager.getInstance().getDataSource(props.useDataSources[0]?.dataSourceId) as FeatureLayerDataSource;

    ds?.queryCount({
      where: "1=1",
      outFields: ["*"],
      returnGeometry: false,
    }).then((data) => {
      // store in redux
      dispatch(appActions.widgetStatePropChange(ePage.storeKey, ePage.sectionKey, { pageIndex: 0, pageSize: pageSize, total: data.count }));
    });
  }

  async function accessMapSample() {
    // Dùng React dev tool để lấy mapWidgetId của map widget
    // Hoặc nếu dùng dataSource được chọn cùng nguồn với map widget thì có thể lấy mapWidgetId từ store mapWidgetInfo
    const jimuMapView = await getJimuMapView(mapWidgetId, _viewManager);

    return jimuMapView;
    // MapView có nhiều method để thao tác với map, tham khảo
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html
  }

  async function gotoMap(geometry: any) {
    const jMapView = await accessMapSample();

    const { geometries } = await projectPointGeometryPolygon(ProjectGeocodeURL, geometry?.spatialReference, jMapView?.view?.spatialReference, geometry?.rings);

    if (!geometries) {
      // setError(eVHVError.noGeometry);
      return;
    }

    const mergedGeometry = mergeGeometry(
      //fnc2
      geometries?.map((geo) => ({
        type: "point",
        ...geo,
        spatialReference: jMapView.view.spatialReference,
      }))
    );

    if (!mergedGeometry) return;

    // zoom to the merged geometry
    await jMapView.view.goTo({ target: mergedGeometry } ?? {}, {});
    // highlight the feature
    if (highlightHandler.current) {
      highlightHandler.current?.remove();
    }
  }

  function storeMethodSample() {
    // dispatch store method
    // Không sử dụng các magic string, number để truy vấn, dùng enum hoặc object để rõ nghĩa
    // const { dispatch } = props;
    // dispatch(appActions.widgetStatePropChange(eDataDMA.storeKey, eDataDMA.sectionKey, withData));

    // get store method
    // Sử dụng ?. để tránh lỗi khi biến chưa có giá trị gây lỗi widget
    const data = getAppStore().getState().widgetsState?.[eDataDMA.storeKey]?.[eDataDMA.sectionKey];
  }

  useEffect(() => {
    // Prevent inaccessibility of the widget when the appToken is not available
    if (!appToken) return;
    clearTimeout(timeout);
    getDs();

    return () => {
      clearTimeout(timeout);
    };
  }, [appToken]);

  useEffect(() => {
    if (!isDataSourcesReady) return;
    queryPaginationCount();
  }, [isDataSourcesReady]);

  useEffect(() => {
    if (!isDataSourcesReady) return;
    queryDataSource();
  }, [pagination]);

  useEffect(() => {
    if (!selectedItem) return;
    const geoDMA = selectedItem.geometry;

    async function zoom() {
      await gotoMap(geoDMA);
    }
    zoom();
  }, [selectedItem]);

  // Widget có nhiều component thì có thể dùng React Context để truyền dữ liệu giữa các component
  // Đa ngôn ngữ https://developers.arcgis.com/experience-builder/guide/extend-base-widget/#i18n-support
  return (
    <>
      {props.useDataSources?.map((useDataSource, index) => (
        <DataSourceComponent key={`data-source-${index}`} useDataSource={useDataSource} widgetId={props.id}></DataSourceComponent>
      ))}
      <div>
        <h1>data for table</h1>
        <TableDMA {...props} isRefetching />
      </div>
    </>
  );
};

export default Widget;
