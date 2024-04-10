import { React, Immutable, UseDataSource } from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import {
  DataSourceSelector,
  AllDataSourceTypes,
} from 'jimu-ui/advanced/data-source-selector';

import { SettingSection } from 'jimu-ui/advanced/setting-components';
import { IMConfig } from '../config';
import AceEditor from '../../../../node_plugin/node_modules/react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import { Button } from 'jimu-ui';
const { useState } = React;
export default function Setting(props: AllWidgetSettingProps<IMConfig>) {
  const { config } = props;
  const [configValue, setConfigValue] = useState<string>(
    JSON.stringify(config, null, 2)
  );

  const onToggleUseDataEnabled = (useDataSourcesEnabled: boolean) => {
    props.onSettingChange({
      id: props.id,
      useDataSourcesEnabled,
    });
  };

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources,
    });
  };
  const _changeConfig = () => {
    if (configValue === JSON.stringify(props.config)) return;
    try {
      if (JSON.parse(configValue)) {
        updateConfigForOptions(JSON.parse(configValue));
      }
    } catch (error) {
      alert('Invalid JSON');
    }
  };
  const updateConfigForOptions = (value: boolean | string) => {
    const config = {
      id: props.id,
      config: value,
    };
    props.onSettingChange(config);
  };

  return (
    <div className="use-feature-layer-setting p-1">
      {/* Chọn Data Source cho Widget */}
      <DataSourceSelector
        types={Immutable([
          AllDataSourceTypes.FeatureService,
          AllDataSourceTypes.FeatureLayer,
        ])}
        useDataSources={props.useDataSources}
        useDataSourcesEnabled={props.useDataSourcesEnabled}
        onToggleUseDataEnabled={onToggleUseDataEnabled}
        onChange={onDataSourceChange}
        widgetId={props.id}
        isMultiple={true}
      />

      {/* Cài đặt JSON config cho Widget*/}
      <SettingSection className="p-0">
        <p>Config</p>
        <Button onClick={_changeConfig}>Submit</Button>
        <AceEditor
          mode="json"
          theme="github"
          name="detail-widget-config-editor"
          editorProps={{ $blockScrolling: true }}
          value={configValue}
          onChange={(e) => setConfigValue(e)}
          width="300px"
        />
      </SettingSection>
    </div>
  );
}
