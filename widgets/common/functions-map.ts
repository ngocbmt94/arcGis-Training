import { JimuMapView, MapViewManager } from "jimu-arcgis";
import { DataRecord, JimuMapViewInfo, getAppStore } from "jimu-core";
import { ImmutableObject } from "seamless-immutable";
import geometryEngine from "esri/geometry/geometryEngine";
import axios from "axios";
export function _getActiveViewId(mapWidgetId: string, infos: ImmutableObject<{ [jimuMapViewId: string]: JimuMapViewInfo }>): string {
  let activeViewId = Object.keys(infos || {}).find((viewId) => infos[viewId].mapWidgetId === mapWidgetId && infos[viewId].isActive);
  if (!activeViewId) {
    activeViewId = Object.keys(infos || {}).find((viewId) => infos[viewId].mapWidgetId === mapWidgetId);
  }
  return activeViewId;
}

export async function getJimuMapView(mapWidgetId: string, _viewManager: MapViewManager) {
  const activeViewId = _getActiveViewId(mapWidgetId, getAppStore().getState().jimuMapViewsInfo);
  const jimuMapView: JimuMapView = _viewManager.getJimuMapViewById(activeViewId);

  return await jimuMapView?.whenJimuMapViewLoaded();
}

export function projectPointGeometry(url: string, inputSpatialReference: any, outputSpatialReference: any, geometry: any) {
  const formData = new FormData();
  formData.append("inSR", JSON.stringify(inputSpatialReference));
  formData.append("outSR", JSON.stringify(outputSpatialReference));
  formData.append("geometries", `${geometry?.x},${geometry?.y}`);
  formData.append("transformation", "");
  formData.append("transformForward", "true");
  formData.append("vertical", "false");
  formData.append("f", "pjson");
  formData.append("token", getAppStore().getState().token);
  const config = {
    method: "post",
    url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios(config);
}

// Đôi khi data trả về là một proxy object, không thể truy cập trực tiếp, hàm này giúp chuyển proxy object về object thông thường
export function retrieveDataInProxy(record: DataRecord) {
  const result: {
    [key: string]: any;
  } = {};
  const proxy = record.getData();
  for (let key in proxy) {
    result[key] = proxy[key];
  }
  return result;
}

export const mergeGeometry = (geometryArr: any[]) => {
  let result: __esri.Geometry;
  result = geometryEngine.union(geometryArr);
  return result;
};

export async function projectPointGeometryPolygon(url: string, inputSpatialReference: any, outputSpatialReference: any, geometry: any) {
  const formData = new FormData();
  formData.append("inSR", JSON.stringify(inputSpatialReference));
  formData.append("outSR", JSON.stringify(outputSpatialReference));
  // formData.append('geometries', `${geometry?.x},${geometry?.y}`);
  formData.append(
    "geometries",
    `{
    "geometryType": "esriGeometryPolygon",
    "geometries": [
      {
        "rings" : ${JSON.stringify(geometry)}
      }
    ]
  }`
  );
  formData.append("transformation", "");
  formData.append("transformForward", "true");
  formData.append("vertical", "false");
  formData.append("f", "pjson");
  formData.append("token", getAppStore().getState().token);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return response.json();
}
