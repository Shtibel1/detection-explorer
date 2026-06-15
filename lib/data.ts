// @ts-nocheck
/* eslint-disable */
/* =============================================================================
 * Detection Catalog — verified against C:\dev\Main-Next
 * Source of truth: CommonApplications\C4I.Applications\Common\[Detections]\*.cs
 * Generic type IDs: ...\Databases\Vulcan\...\Configuration.GenericDetectionTypes.sql
 * ===========================================================================*/

/* ---- Base classes every detection inherits -------------------------------- */
// UniqueData (root) -> DetectionBase -> concrete detection
export const BASE_FIELDS = [
  { name: 'Id',             type: 'Guid',              from: 'UniqueData',    desc: 'Unique identifier for the record.' },
  { name: 'Time',           type: 'DateTime',          from: 'UniqueData',    desc: 'Time of the detection / event.' },
  { name: 'DataType',       type: 'int',               from: 'UniqueData',    desc: 'Detection-type identifier. Abstract / computed via EnumFactory — not a stored value you set.' },
  { name: 'IsFailed',       type: 'bool',              from: 'DetectionBase', desc: 'Indicates the detection failed (e.g. a key read failed).' },
  { name: 'Location',       type: 'string',            from: 'DetectionBase', desc: 'Geographic location, WKT — "POINT (X Y)" or "POINT (X Y Z)" where Z is height.' },
  { name: 'Height',         type: 'double',            from: 'DetectionBase', desc: 'Computed from the Z component of Location (min value when absent). Read-only.' },
  { name: 'PhysicalId',     type: 'string',            from: 'DetectionBase', desc: 'Physical identifier of the sensor.' },
  { name: 'SensorId',       type: 'int',               from: 'DetectionBase', desc: 'Internal sensor identifier.' },
  { name: 'SourceType',     type: 'int',               from: 'DetectionBase', desc: 'Identifier of the source / adapter that produced the detection.' },
  { name: 'Credibility',    type: 'int?',              from: 'DetectionBase', desc: 'Credibility score of the detection.' },
  { name: 'Classification', type: 'short',             from: 'DetectionBase', desc: 'Classification level (maps to DetectionClassificationState; default 0).' },
  { name: 'SensorLocation', type: 'string',            from: 'DetectionBase', desc: 'Geographic location of the sensor itself (WKT).' },
  { name: 'Files',          type: 'List<FileObject>',  from: 'DetectionBase', desc: 'Attached files (images, thumbnails, audio…). See FileObject below.' },
  { name: 'AdapterId',      type: 'int',               from: 'DetectionBase', desc: 'Identifier of the adapter.' },
  { name: 'DataCenterId',   type: 'Guid',              from: 'DetectionBase', desc: 'Identifier of the data center.' },
];

// FileObject — the shape of each entry in DetectionBase.Files
export const FILE_OBJECT_FIELDS = [
  { name: 'File',      type: 'byte[]',   desc: 'Raw bytes (often null when delivered by URL).' },
  { name: 'FileId',    type: 'int?',     desc: 'Sequential file id within the detection.' },
  { name: 'FileType',  type: 'FileType', desc: 'Enum: Image, Audio, Video, Text, Pdf, Thumbnail, Doc.' },
  { name: 'Tag',       type: 'string',   desc: 'Role tag, e.g. "DetectionImage", "Thumbnail", "PlateImage".' },
  { name: 'MimeType',  type: 'string',   desc: 'MIME type of the file.' },
  { name: 'Url',       type: 'string',   desc: 'Storage path / URL of the file.' },
  { name: 'IsPrimary', type: 'bool',     desc: 'Whether this is the primary file of the detection.' },
];

/* ---- Helper "extra type" tables referenced from field notes ------------- */
export const SUPPORTING_TYPES = {
  VehicleID: [
    { name: 'PlateNumber',                     type: 'string', desc: 'Recognised plate text.' },
    { name: 'PlateNumberConfidence',           type: 'int?',   desc: 'Confidence of the plate read.' },
    { name: 'PlateTemplate',                   type: 'int?',   desc: 'Internal plate template id.' },
    { name: 'PlateTemplateColor',              type: 'int?',   desc: 'Plate template colour code.' },
    { name: 'PlateTemplateCode',               type: 'string', desc: 'Plate template code.' },
    { name: 'ExternalPlateTemplate',           type: 'int?',   desc: 'Vendor plate template id.' },
    { name: 'ExternalPlateTemplateConfidence', type: 'int?',   desc: 'Vendor template confidence.' },
    { name: 'Make / ExternalMake',             type: 'int? / string', desc: 'Vehicle make (internal id and vendor string).' },
    { name: 'Model / ExternalModel',           type: 'int? / string', desc: 'Vehicle model (internal id and vendor string).' },
    { name: 'ModelYear',                       type: 'int?',   desc: 'Model year.' },
    { name: 'Color / Color2',                  type: 'int?',   desc: 'Primary / secondary colour codes.' },
    { name: 'VehicleClass',                    type: 'int?',   desc: 'Vehicle class code.' },
  ],
  ViSensorInfo: [
    { name: 'GlobalID',   type: 'int',        desc: 'Global sensor id.' },
    { name: 'SensorType', type: 'SensorType', desc: 'Enum: Video, DigitalInput, DigitalOutput, PtzPreset.' },
  ],
  ViRuleInfo: [
    { name: 'Id',       type: 'uint',      desc: 'Rule id.' },
    { name: 'Name',     type: 'string',    desc: 'Rule name.' },
    { name: 'RuleType', type: 'string',    desc: 'Rule type.' },
    { name: 'SubType',  type: 'string',    desc: 'Rule sub-type.' },
    { name: 'GUID / RuleGUID', type: 'Guid', desc: 'Rule identifiers.' },
    { name: 'Points',   type: 'PointF[]',  desc: 'Rule polygon points.' },
  ],
  ViObjectInfo: [
    { name: 'Id',          type: 'uint',          desc: 'Tracked object id.' },
    { name: 'Type',        type: 'string',        desc: 'Object type, e.g. person / vehicle.' },
    { name: 'Size',        type: 'float',         desc: 'Object size.' },
    { name: 'ColorARGB',   type: 'Color',         desc: 'Dominant colour.' },
    { name: 'Speed / ScreenSpeed / SpeedAngle', type: 'float', desc: 'Motion attributes.' },
    { name: 'BoundingBox', type: 'ViBoundingBox', desc: 'Left/Top/Right/Bottom box.' },
    { name: 'HistoryPath', type: 'ViHistoryPathInfo', desc: 'Path points over time.' },
  ],
  ReportCategoryDto: [
    { name: 'CategoryId', type: 'int',    desc: 'Category id.' },
    { name: 'Label',      type: 'string', desc: 'Human-readable category label.' },
  ],
};

/* ---- Strongly-typed detections ------------------------------------------ */
export const TYPED_DETECTIONS = [
  {
    id: 'lpr',
    name: 'License Plate Recognition',
    className: 'C4ILprDetection',
    icon: 'car',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/C4ILprDetection.cs',
    summary: 'Vehicle plate reads from gantry / roadside LPR cameras. Carries the recognised vehicle, lane / gantry context, speed information and the overview + plate-crop images. Implements IContainImages, IVendorConfidence.',
    fields: [
      { name: 'Confidence',         type: 'int',              desc: 'Vendor confidence, 0–100. NormalizedConfidenceLevel exposes it as 0–1.' },
      { name: 'VehicleId',          type: 'VehicleID',        desc: 'Recognised vehicle (plate text, template, make/model/colour…).', sub: 'VehicleID' },
      { name: 'TemplateVersion',    type: 'int',              desc: 'Plate template version.' },
      { name: 'GantryId',           type: 'int',              desc: 'Gantry / infrastructure identifier.' },
      { name: 'LaneId',             type: 'int',              desc: 'Traffic lane identifier.' },
      { name: 'LanePosition',       type: 'int',              desc: 'Lane position. Not persisted to DB.' },
      { name: 'TotalLanes',         type: 'int',              desc: 'Total lanes. Not persisted to DB.' },
      { name: 'SegmentId',          type: 'int',              desc: 'Road segment id. Not persisted to DB.' },
      { name: 'SensorMaximumSpeed', type: 'int?',             desc: 'Speed limit of the sensor. Not persisted to DB.' },
      { name: 'Speed',              type: 'int?',             desc: 'Detected vehicle speed.' },
      { name: 'SpeedConfidence',    type: 'int?',             desc: 'Confidence of the speed measurement.' },
      { name: 'OverviewImage',      type: 'ImageFile',        desc: 'Wide overview image. Derived from Files.' },
      { name: 'PlateImage',         type: 'ImageFile',        desc: 'Cropped plate image. Derived from Files.' },
      { name: 'Direction',          type: 'string',          desc: 'Direction of travel.' },
      { name: 'AdditionalImages',   type: 'List<ImageFile>',  desc: 'Extra images. Deprecated — use Files.' },
    ],
    subtypes: [
      { className: 'C4ILprRedlightDetection', extends: 'C4ILprDetection', adds: [
          { name: 'RedLightTimeSpan', type: 'TimeSpan?', desc: 'Elapsed time between red-light onset and the vehicle crossing.' } ] },
      { className: 'C4ILprSpeedingDetection', extends: 'C4ILprDetection', adds: [],
        note: 'No new fields — a distinct type that uses Speed / SensorMaximumSpeed from the LPR base.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Confidence": 95,
  "VehicleId": {
    "PlateNumber": "12-345-67",
    "PlateTemplate": null
  },
  "GantryId": 12,
  "LaneId": 2,
  "Speed": 80,
  "Direction": "North",
  "PhysicalId": "LPR-Cam-01",
  "SensorId": 1001,
  "SourceType": 2
}`
  },

  {
    id: 'face',
    name: 'Face Recognition',
    className: 'FaceDetection',
    icon: 'scan-face',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/FaceDetection.cs',
    summary: 'A face captured by a camera and matched against watch-list cases. Implements IContainImages. Match details (case id + score) arrive in the FaceMatches array of the incoming payload.',
    fields: [
      { name: 'DetectionImage', type: 'ImageFile', desc: 'Image the face was identified from. Derived from Files.' },
      { name: 'FIRs',           type: 'byte[]',    desc: 'Biometric face template (Face Image Record).' },
      { name: 'TrackingID',     type: 'Guid',      desc: 'Tracking identifier for the face across frames.' },
      { name: 'BsaScore',       type: 'double',    desc: 'Best-Shot-Analyzer quality / match score.' },
    ],
    inboundExtras: 'The vendor payload also carries Gender, Ethnicity, EstimatedAge, EvidenceTimeStamp, EventName and a FaceMatches[] list (CaseID, Score, …) which are mapped on ingest.',
    example: `{
  "Gender": null,
  "Ethnicity": null,
  "EstimatedAge": 0,
  "EvidenceTimeStamp": "2026-06-01T06:51:37.3316441Z",
  "FaceMatches": [
    {
      "CaseID": 1263810,
      "Score": 0.209565431,
      "FaceRecognitionDetectionID": "ee8d1713-1096-43e8-b2c0-1f7320ac3634",
      "Id": "fbbe05b6-1d6d-4aed-8e6b-aa646a01d012",
      "Time": "2026-06-01T06:51:37.3316441Z"
    }
  ],
  "TrackingID": "00000000-0000-0000-0000-000000000000",
  "IsFailed": false,
  "Location": "POINT (-93.1704810248889 16.7404914234367 8)",
  "PhysicalId": "a8482c02-9968-4176-9a3b-9c350e31612b",
  "SensorId": 21912,
  "SourceType": 101,
  "SensorLocation": "POINT (-93.1704810248889 16.7404914234367 8)",
  "Files": [
    { "FileId": 1, "FileType": 1, "Tag": "DetectionImage", "Url": "detection\\\\2026\\\\6\\\\1\\\\6\\\\ee8d1713-..._1", "IsPrimary": true },
    { "FileId": 2, "FileType": 6, "Tag": "Thumbnail",      "Url": "detection\\\\2026\\\\6\\\\1\\\\6\\\\ee8d1713-..._2", "IsPrimary": false }
  ],
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "ee8d1713-1096-43e8-b2c0-1f7320ac3634",
  "Time": "2026-06-01T06:51:37.3316441Z"
}`
  },

  {
    id: 'vi',
    name: 'Video Analytics',
    className: 'VIDetectionFull',
    icon: 'video',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/VIDetectionFull.cs',
    summary: 'Events from advanced video-analytics engines (rule triggers, object tracks, camera-health events). Carries structured sensor / rule / object metadata. Implements IContainImages, IRelatedDetectionType.',
    fields: [
      { name: 'EventID',        type: 'int',         desc: 'Event id in the video system.' },
      { name: 'DateTime',       type: 'DateTime',    desc: 'Exact event time.' },
      { name: 'Description',    type: 'string',      desc: 'Primary description.' },
      { name: 'Description2',   type: 'string',      desc: 'Secondary description.' },
      { name: 'SensorInfo',     type: 'ViSensorInfo', desc: 'Structured camera / sensor info.', sub: 'ViSensorInfo' },
      { name: 'RuleInfo',       type: 'ViRuleInfo',  desc: 'Structured rule info.', sub: 'ViRuleInfo' },
      { name: 'ObjectInfo',     type: 'ViObjectInfo', desc: 'Structured detected-object info.', sub: 'ViObjectInfo' },
      { name: 'EventTypeID',    type: 'int',         desc: 'Event-type identifier.' },
      { name: 'EventType',      type: 'ViEventType', desc: 'Enum: Rule, CameraLowQuality, NoVideo, DigitalInput, UserTriggered, NoCommunication, NoLicense, PtzCalibration.' },
      { name: 'ExternalRuleId', type: 'int',         desc: 'Rule id from the third-party system.' },
      { name: 'EventImage',     type: 'ImageFile',   desc: 'Captured event image. Derived from Files.' },
      { name: 'SegmentID',      type: 'int?',        desc: 'Geographic / traffic segment id.' },
      { name: 'DetectionSubType', type: 'string',    desc: 'Sub-type of the detection.' },
      { name: 'OrganizationId', type: 'int?',        desc: 'Owning organisation.' },
      { name: 'UserId',         type: 'int?',        desc: 'Associated user.' },
      { name: 'Severity',       type: 'int?',        desc: 'Event severity.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "IsFailed": false,
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Camera-01",
  "SensorId": 5001,
  "SourceType": 3,
  "EventID": 12345,
  "DateTime": "{{timestamp}}",
  "Description": "Intrusion detected in zone A",
  "EventTypeID": 101,
  "DetectionSubType": "Intrusion"
}`
  },

  {
    id: 'environment',
    name: 'Environment Sensors',
    className: 'EnvironmentDetection',
    icon: 'thermometer-sun',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/EnvironmentDetection.cs',
    summary: 'Meteorological and air-quality readings. Every measurement is nullable — a sensor reports only the channels it supports.',
    fields: [
      { name: 'Temperature',     type: 'double?', desc: 'Temperature (°C).' },
      { name: 'RelativeHumidity', type: 'double?', desc: 'Relative humidity (RH%).' },
      { name: 'AirPressure',     type: 'double?', desc: 'Air pressure (mBar).' },
      { name: 'Dust',            type: 'double?', desc: 'Particulates (mg/Nm³).' },
      { name: 'Ozone',           type: 'double?', desc: 'Ozone (ppm).' },
      { name: 'NOx',             type: 'double?', desc: 'Nitrogen oxides (ppm).' },
      { name: 'SolarRadiation',  type: 'double?', desc: 'Solar radiation (W/m²).' },
      { name: 'SO2',             type: 'double?', desc: 'Sulfur dioxide (ppm).' },
      { name: 'CO2',             type: 'double?', desc: 'Carbon dioxide (ppm).' },
      { name: 'Noise',           type: 'double?', desc: 'Noise level (dB).' },
      { name: 'Wind',            type: 'double?', desc: 'Wind speed (km/h).' },
      { name: 'Proximity',       type: 'double?', desc: 'Proximity sensor.' },
      { name: 'Gas',             type: 'double?', desc: 'General gas concentration (ppm).' },
      { name: 'Light',           type: 'double?', desc: 'Luminance level.' },
      { name: 'Alcohol',         type: 'double?', desc: 'Alcohol concentration (ppm).' },
      { name: 'C6H6',            type: 'double?', desc: 'Benzene (ppm).' },
      { name: 'NH3',             type: 'double?', desc: 'Ammonia (ppm).' },
      { name: 'VOC5',            type: 'double?', desc: 'Volatile organic compounds (ppm).' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "IsFailed": false,
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Weather-Station-01",
  "SensorId": 6001,
  "SourceType": 6,
  "Temperature": 24.5,
  "RelativeHumidity": 60.0,
  "AirPressure": 1013.2,
  "Dust": 0.05,
  "CO2": 415.0,
  "Noise": 45.0,
  "Wind": 12.5
}`
  },

  {
    id: 'mcp',
    name: 'Reports & Events',
    className: 'McpDetection',
    icon: 'siren',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/McpDetection.cs',
    summary: 'Citizen / field reports, engagements and resource events (e.g. mobile SOS reports). Implements IMcpDetection.',
    fields: [
      { name: 'LocationAccuracy', type: 'double',            desc: 'Accuracy of the reported location.' },
      { name: 'Description',      type: 'string',            desc: 'Report text.' },
      { name: 'NewReport',        type: 'bool',              desc: 'Whether this is a brand-new report.' },
      { name: 'ResourceId',       type: 'Guid',              desc: 'Reporting / involved resource.' },
      { name: 'EngagementId',     type: 'Guid',              desc: 'Engagement identifier.' },
      { name: 'TransactionID',    type: 'string',            desc: 'Transaction / operation id. Not persisted to DB.' },
      { name: 'Severity',         type: 'int?',              desc: 'Severity level.' },
      { name: 'ReportCategory',   type: 'ReportCategoryDto', desc: 'Report category.', sub: 'ReportCategoryDto' },
      { name: 'Image',            type: 'byte[]',            desc: 'Attached image. Derived from Files.' },
      { name: 'DetectionSubType', type: 'string',            desc: 'Sub-type of the report.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "IsFailed": false,
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Reporter-Mobile",
  "SensorId": 7001,
  "SourceType": 7,
  "LocationAccuracy": 5.0,
  "Description": "SOS Report from mobile app",
  "NewReport": true,
  "Severity": 3,
  "DetectionSubType": "SOS"
}`
  },

  {
    id: 'adam',
    name: 'Adam Sensors',
    className: 'AdamDetectionBase',
    icon: 'door-closed',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/AdamDetections.cs',
    summary: 'I/O contact-closure sensors (Adam family) — doors, panic buttons, fire, restricted-area intrusion, street-cabinet status. AdamDetectionBase adds the four fields below; each concrete type only overrides DataType and adds no further fields.',
    fields: [
      { name: 'UnitId',       type: 'int',    desc: 'Sensor unit identifier.' },
      { name: 'ChannelId',    type: 'int',    desc: 'Channel identifier.' },
      { name: 'CurrentState', type: 'bool',   desc: 'Current state of the contact / channel.' },
      { name: 'Description',  type: 'string', desc: 'Free-text description.' },
    ],
    concreteTypes: [
      'AdamFireDetection',
      'AdamAuthorizedPersonEnteredRestrictedAreaDetection',
      'AdamUnauthorizedAttemptToEnterArestrictedAreaDetection',
      'AdamDoorLeftOpenDetection',
      'AdamDoorForcedOpenDetection',
      'AdamPanicButtonPressedDetection',
      'AdamStreetCabinetOverTemperatureDetection',
      'AdamStreetCabinetPowerSupplyDetection',
      'AdamStreetCabinetTamperDetection',
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "IsFailed": false,
  "Location": "POINT (34.8 32)",
  "PhysicalId": "ADAM-Unit-03",
  "SensorId": 4001,
  "SourceType": 4,
  "UnitId": 3,
  "ChannelId": 1,
  "CurrentState": true,
  "Description": "Authorized Person Entered Restricted Area"
}`
  },

  {
    id: 'segment',
    name: 'Aggregated Segment Data',
    className: 'AggregatedSegmentData',
    icon: 'gauge',
    base: null,
    standalone: true,
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/AggregatedSegmentData.cs',
    summary: 'Aggregated traffic statistics for a road segment. NOTE: this is a standalone data structure — it does NOT inherit from DetectionBase, so it has none of the base fields (no Id/Location/SensorId etc.).',
    fields: [
      { name: 'SegmentId',      type: 'int',            desc: 'Segment identifier.' },
      { name: 'SampleTime',     type: 'DateTimeOffset', desc: 'Sampling time.' },
      { name: 'MeanSpeedInKph', type: 'long',           desc: 'Average speed in the segment (kph).' },
      { name: 'Volume',         type: 'long',           desc: 'Sampled traffic volume.' },
      { name: 'LevelOfService', type: 'long',           desc: 'Segment level of service.' },
      { name: 'MeanTimeSec',    type: 'double',         desc: 'Average travel time (seconds).' },
    ],
    example: `{
  "SegmentId": 4501,
  "SampleTime": "2026-06-15T09:00:00+00:00",
  "MeanSpeedInKph": 64,
  "Volume": 1280,
  "LevelOfService": 2,
  "MeanTimeSec": 41.5
}`
  },

  /* ---- Main-Global-only typed detections (not present in Main-Next) ----- */
  {
    id: 'face-recognition', origin: 'global', illustrative: false,
    name: 'Face Recognition (enriched)',
    className: 'FaceRecognition',
    icon: 'scan-face',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/FaceRecognition.cs',
    summary: 'Richer face type in Main-Global (implements ICloneable, IContainImages, IVendorConfidence). Carries demographic estimates and the full FaceMatches list. The captured vendor payload your team had on record (Gender/Ethnicity/EstimatedAge/FaceMatches/EvidenceTimeStamp…) maps to THIS class, not the leaner FaceDetection.',
    fields: [
      { name: 'Gender',                  type: 'string',           desc: 'Estimated gender.' },
      { name: 'Ethnicity',               type: 'string',           desc: 'Estimated ethnicity.' },
      { name: 'EstimatedAge',            type: 'int',              desc: 'Estimated age.' },
      { name: 'TransactionId',           type: 'string',           desc: 'Vendor transaction id.' },
      { name: 'EvidenceTimeStamp',       type: 'DateTime',         desc: 'Time the evidence frame was captured.' },
      { name: 'FaceMatches',             type: 'IList<FaceMatch>', desc: 'All watch-list matches (CaseID, Score, …).' },
      { name: 'FaceMatch',               type: 'FaceMatch',        desc: 'Computed — first/best of FaceMatches.' },
      { name: 'EventName',               type: 'string',           desc: 'Event name.' },
      { name: 'DetectionImage',          type: 'ImageFile',        desc: 'Image tagged "DetectionImage" from Files.' },
      { name: 'TrackingID',              type: 'Guid',             desc: 'Track id across frames.' },
      { name: 'NormalizedConfidenceLevel', type: 'double',         desc: 'Computed from FaceMatch.Score.' },
    ],
    example: `{
  "Gender": null,
  "Ethnicity": null,
  "EstimatedAge": 0,
  "TransactionId": null,
  "EvidenceTimeStamp": "2026-06-01T06:51:37.3316441Z",
  "FaceMatches": [
    {
      "CaseID": 1263810,
      "Score": 0.209565431,
      "FaceRecognitionDetectionID": "ee8d1713-1096-43e8-b2c0-1f7320ac3634",
      "Id": "fbbe05b6-1d6d-4aed-8e6b-aa646a01d012",
      "Time": "2026-06-01T06:51:37.3316441Z"
    }
  ],
  "EventName": null,
  "TrackingID": "00000000-0000-0000-0000-000000000000",
  "IsFailed": false,
  "Location": "POINT (-93.1704810248889 16.7404914234367 8)",
  "PhysicalId": "a8482c02-9968-4176-9a3b-9c350e31612b",
  "SensorId": 21912,
  "SourceType": 101,
  "SensorLocation": "POINT (-93.1704810248889 16.7404914234367 8)",
  "Files": [
    { "FileId": 1, "FileType": 1, "Tag": "DetectionImage", "Url": "detection\\\\2026\\\\6\\\\1\\\\6\\\\ee8d1713-..._1", "IsPrimary": true }
  ],
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "ee8d1713-1096-43e8-b2c0-1f7320ac3634",
  "Time": "2026-06-01T06:51:37.3316441Z"
}`
  },
  {
    id: 'environmental', origin: 'global', illustrative: true,
    name: 'Air Quality (Environmental)',
    className: 'EnvironmentalDetection',
    icon: 'wind',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/Environmental/EnvironmentalDetection.cs',
    summary: 'Air-quality / gas readings in Main-Global. A SEPARATE class from the older EnvironmentDetection — they coexist with different field sets (this one focuses on pollutants and particulates).',
    fields: [
      { name: 'CO',    type: 'double?', desc: 'Carbon monoxide.' },
      { name: 'CO2',   type: 'double?', desc: 'Carbon dioxide.' },
      { name: 'NO',    type: 'double?', desc: 'Nitric oxide.' },
      { name: 'NO2',   type: 'double?', desc: 'Nitrogen dioxide.' },
      { name: 'SO2',   type: 'double?', desc: 'Sulfur dioxide.' },
      { name: 'PM2_5', type: 'double?', desc: 'Particulate matter ≤2.5µm.' },
      { name: 'O3',    type: 'double?', desc: 'Ozone.' },
      { name: 'UV',    type: 'double?', desc: 'UV index.' },
      { name: 'PM10',  type: 'double?', desc: 'Particulate matter ≤10µm.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "AQ-Station-02",
  "SourceType": 6,
  "CO": 0.4, "CO2": 410.0, "NO": 0.01, "NO2": 0.02, "SO2": 0.005,
  "PM2_5": 12.3, "O3": 0.03, "UV": 4.0, "PM10": 20.1
}`
  },
  {
    id: 'weather', origin: 'global', illustrative: true,
    name: 'Weather',
    className: 'WeatherDetection',
    icon: 'cloud-sun',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/Weather/WeatherDetection.cs',
    summary: 'Meteorological readings in Main-Global (namespace DetectionsContracts).',
    fields: [
      { name: 'Temperature',   type: 'double?',         desc: 'Temperature.' },
      { name: 'Humidity',      type: 'double?',         desc: 'Humidity.' },
      { name: 'WindSpeed',     type: 'double?',         desc: 'Wind speed.' },
      { name: 'Rain',          type: 'double?',         desc: 'Rain.' },
      { name: 'Hail',          type: 'double?',         desc: 'Hail.' },
      { name: 'Pressure',      type: 'double?',         desc: 'Air pressure.' },
      { name: 'WindDirection', type: 'WindDirections?', desc: 'Compass wind direction enum.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Weather-Station-09",
  "SourceType": 6,
  "Temperature": 24.5, "Humidity": 60.0, "WindSpeed": 12.0,
  "Rain": 0.0, "Hail": 0.0, "Pressure": 1013.0, "WindDirection": "N"
}`
  },
  {
    id: 'structural', origin: 'global', illustrative: true,
    name: 'Structural Health',
    className: 'StructuralDetection',
    icon: 'building-2',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/Structural/StructuralDetection.cs',
    summary: 'Structural monitoring (strain / vibration / tilt) in Main-Global — e.g. for bridges and buildings.',
    fields: [
      { name: 'Strain',    type: 'double?', desc: 'Measured strain.' },
      { name: 'Vibration', type: 'double?', desc: 'Vibration level.' },
      { name: 'Tilt_X',    type: 'double?', desc: 'Tilt on X axis.' },
      { name: 'Tilt_Y',    type: 'double?', desc: 'Tilt on Y axis.' },
      { name: 'Tilt_Z',    type: 'double?', desc: 'Tilt on Z axis.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Bridge-Sensor-3",
  "SourceType": 30,
  "Strain": 0.002, "Vibration": 0.15,
  "Tilt_X": 0.01, "Tilt_Y": 0.0, "Tilt_Z": 0.0
}`
  },
  {
    id: 'traffic-measurement', origin: 'global', illustrative: true,
    name: 'Traffic Measurement',
    className: 'TrafficMeasurementDetection',
    icon: 'gauge',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/Traffic/TrafficMeasurementDetection.cs',
    summary: 'Per-segment traffic measurement in Main-Global (volume, speed, occupancy, level of service).',
    fields: [
      { name: 'ParentId',                type: 'int',                desc: 'Parent sensor / device id.' },
      { name: 'SegmentID',               type: 'int',                desc: 'Road segment id.' },
      { name: 'OccupancyInPercentage',   type: 'short',              desc: 'Lane occupancy (%).' },
      { name: 'SampleIntervalInSec',     type: 'int',                desc: 'Sampling interval (sec).' },
      { name: 'LevelOfService',          type: 'int',                desc: 'Level of service.' },
      { name: 'ObjectClassificationType', type: 'ClassificationType', desc: 'Vehicle class enum.' },
      { name: 'Count',                   type: 'int',                desc: 'Object count in the interval.' },
      { name: 'VolumePerMinute',         type: 'double',             desc: 'Flow volume per minute.' },
      { name: 'MeanSpeedInKph',          type: 'double',             desc: 'Mean speed (kph).' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Loop-12",
  "SourceType": 40,
  "ParentId": 12, "SegmentID": 4501, "OccupancyInPercentage": 35,
  "SampleIntervalInSec": 60, "LevelOfService": 2,
  "ObjectClassificationType": "Car", "Count": 120,
  "VolumePerMinute": 30.0, "MeanSpeedInKph": 64.0
}`
  },
  {
    id: 'high-occupancy', origin: 'global', illustrative: true,
    name: 'High-Occupancy Traffic',
    className: 'HighOccupancyTrafficDetection',
    icon: 'traffic-cone',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/Traffic/HighOccupancyTrafficDetection.cs',
    summary: 'Congestion alarm in Main-Global — fires when a segment crosses an occupancy threshold.',
    fields: [
      { name: 'Alarm', type: 'HighOccupancyLevel', desc: 'Enum severity of the high-occupancy condition.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Segment-4501",
  "SourceType": 40,
  "Alarm": "High"
}`
  },
  {
    id: 'common-detection', origin: 'global', illustrative: true,
    name: 'Common Detection',
    className: 'CommonDetection',
    icon: 'circle-dot',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/CommonDetection.cs',
    summary: 'A lightweight generic-purpose typed detection in Main-Global. TypeOfDetection drives the DataType.',
    fields: [
      { name: 'Confidence',      type: 'int', desc: 'Confidence (private setter).' },
      { name: 'TypeOfDetection', type: 'int', desc: 'Sub-type id that drives DataType.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Sensor-01",
  "SensorId": 9001,
  "SourceType": 9,
  "Confidence": 80,
  "TypeOfDetection": 1
}`
  },
  {
    id: 'dynamic-location', origin: 'global', illustrative: true,
    name: 'Dynamic Location',
    className: 'DynamicLocationDetection',
    icon: 'navigation',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/DynamicLocationDetection.cs',
    summary: 'Moving-asset position update in Main-Global. NOTE: its SourceType is a DynamicLocationDetectionSourceType enum that shadows the base int SourceType.',
    fields: [
      { name: 'SourceType',   type: 'DynamicLocationDetectionSourceType', desc: 'Enum — shadows the base int SourceType.' },
      { name: 'Accuracy',     type: 'decimal?', desc: 'Position accuracy.' },
      { name: 'Heading',      type: 'decimal?', desc: 'Heading (degrees).' },
      { name: 'VerticalTilt', type: 'decimal?', desc: 'Vertical tilt.' },
      { name: 'Speed',        type: 'decimal?', desc: 'Speed.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Tracker-07",
  "SourceType": 1,
  "Accuracy": 5.0, "Heading": 270.0, "VerticalTilt": 0.0, "Speed": 42.5
}`
  },
  {
    id: 'external-detection', origin: 'global', illustrative: true,
    name: 'External Detection',
    className: 'ExternalDetection',
    icon: 'plug',
    base: 'DetectionBase',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/ExternalDetection.cs',
    summary: 'Pass-through event from an external system in Main-Global (implements IContainImages).',
    fields: [
      { name: 'EventImage',  type: 'ImageFile', desc: 'Event image. Derived from Files.' },
      { name: 'EventID',     type: 'int',       desc: 'External event id.' },
      { name: 'Description', type: 'string',    desc: 'Event description.' },
    ],
    example: `{
  "Id": "{{guid}}",
  "Time": "{{timestamp}}",
  "Location": "POINT (34.8 32)",
  "PhysicalId": "Ext-Sys-01",
  "SourceType": 50,
  "EventID": 8842,
  "Description": "External event",
  "Files": []
}`
  },
  {
    id: 'uav-telemetry', origin: 'global', illustrative: true, standalone: true,
    name: 'UAV Telemetry',
    className: 'TelemetryInfo',
    icon: 'plane',
    base: null,
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/UAV/TelemetryInfo.cs',
    summary: 'Drone / UAV telemetry frame in Main-Global. STANDALONE — does NOT inherit DetectionBase; carries its own location and platform/sensor pose fields.',
    fields: [
      { name: 'PlatformID',          type: 'string',   desc: 'Platform identifier.' },
      { name: 'GroundStationUnitId', type: 'int',      desc: 'Ground-station unit id.' },
      { name: 'DetectionTime / EventStartTime', type: 'DateTime', desc: 'Detection / event-start times.' },
      { name: 'Lat / Long / Altitude', type: 'double', desc: 'Position.' },
      { name: 'Location',            type: 'string',   desc: 'Computed WKT (IgnoreDataMember).' },
      { name: 'Heading / Pitch / Roll', type: 'double', desc: 'Platform attitude.' },
      { name: 'GroundSpeed',         type: 'int',      desc: 'Ground speed.' },
      { name: 'WindSpeed',           type: 'double',   desc: 'Wind speed.' },
      { name: 'MissionID / PlatformDesignation', type: 'string', desc: 'Mission / platform labels.' },
      { name: 'SensorType',          type: 'string',   desc: 'Sensor type.' },
      { name: 'SensorHorizontalFOV / SensorVerticalFOV', type: 'double', desc: 'Sensor field of view.' },
      { name: 'SensorRelativeAzimuth / Elevation / Roll', type: 'double', desc: 'Sensor pose relative to platform.' },
      { name: 'AmbientTemp',         type: 'double',   desc: 'Ambient temperature.' },
      { name: 'IsOnline',            type: 'bool',     desc: 'Platform online flag.' },
      { name: 'FrameCenterLatitude / Longitude / Elevation', type: 'double', desc: 'Sensor frame-center geo.' },
    ],
    example: `{
  "PlatformID": "UAV-01",
  "GroundStationUnitId": 3,
  "DetectionTime": "{{timestamp}}",
  "Lat": 32.0, "Long": 34.8, "Altitude": 120.0,
  "TrackingId": "trk-558",
  "Heading": 90.0, "Pitch": -2.0, "Roll": 0.0,
  "GroundSpeed": 14, "WindSpeed": 6.5,
  "MissionID": "M-2026-118", "SensorType": "EO",
  "IsOnline": true,
  "FrameCenterLatitude": 32.001, "FrameCenterLongitude": 34.802, "FrameCenterElevation": 0.0
}`
  },
  {
    id: 'ws-health', origin: 'global', illustrative: true, standalone: true,
    name: 'Workstation Health Notification',
    className: 'WsHealthStatusNotification',
    icon: 'activity',
    base: 'HealthStatus',
    file: 'CommonApplications/C4I.Applications/Common/[Detections]/WsHealthStatusNotification.cs',
    summary: 'Health-status notification in Main-Global. NOTE: it extends HealthStatus, NOT DetectionBase — so it does not carry the standard detection base fields.',
    fields: [],
    example: `{
  "DataType": 0,
  "Id": "{{guid}}",
  "Time": "{{timestamp}}"
}`
  },
];

/* ---- Generic detections -------------------------------------------------- */
// GenericDetection base
export const GENERIC_BASE = {
  className: 'GenericDetection',
  base: 'DetectionBase',
  file: 'CommonApplications/C4I.Applications/Common/[Detections]/GenericDetection.cs',
  summary: 'A single flexible type used for dozens of integrations. Instead of a rigid schema it carries a key/value bag (AdditionalParameters._parameters : Dictionary<string,string>). The concrete kind is identified by GenericDetectionTypeId; the name resolves via the GenericDetectionTypes enum.',
  fields: [
    { name: 'GenericDetectionTypeId',   type: 'int',                desc: 'Numeric id of the generic type (see registry).' },
    { name: 'GenericDetectionTypeName', type: 'string',             desc: 'Read-only — resolved from the id via EnumFactory["GenericDetectionTypes"].' },
    { name: 'AdditionalParameters',     type: 'MetaDataParameters', desc: 'Wrapper around a Dictionary<string,string>. Serialised as AdditionalParameters._parameters.' },
  ],
};

// Full registry verified from Configuration.GenericDetectionTypes.sql
// Each: { id, name, label, params?: [...], example?: "...", note?: "..." }
export const GENERIC_TYPES = [
  { id: 1,  name: 'Milestone_Lpr_HealthStatus',   label: 'Milestone Lpr HealthStatus',   family: 'Health status' },
  { id: 2,  name: 'Milestone_Ptz_HealthStatus',   label: 'Milestone Ptz HealthStatus',   family: 'Health status' },
  { id: 3,  name: 'Milestone_Fixed_HealthStatus', label: 'Milestone Fixed HealthStatus', family: 'Health status' },
  { id: 4,  name: 'Neurosoft_Lpr_HealthStatus',   label: 'Neurosoft Lpr HealthStatus',   family: 'Health status' },
  { id: 5,  name: 'Dvtel_Face_HealthStatus',      label: 'Dvtel Face HealthStatus',      family: 'Health status' },
  { id: 6,  name: 'Dvtel_Fixed_HealthStatus',     label: 'Dvtel Fixed HealthStatus',     family: 'Health status' },
  { id: 7,  name: 'DvTel_Ptz_Healthstatus',       label: 'DvTel Ptz Healthstatus',       family: 'Health status' },

  { id: 10000, name: 'DgSense',        label: 'DgSense',                family: 'Sensors' },
  { id: 10001, name: 'CShare_SOS',     label: 'CShare SOS Detection',   family: 'CShare',
    params: ['PhoneNumber','ConvId','UserId','Language','zoneId','siteId','StreetAddress','MsgType','DetectionType','DetectionTypeId'],
    example: `{
  "GenericDetectionTypeId": 10001,
  "AdditionalParameters": {
    "_parameters": {
      "PhoneNumber": "972549764530",
      "ConvId": "inTlsWt46LWmbLxE3guH",
      "UserId": "972549764530",
      "Language": "en_US",
      "zoneId": "0",
      "siteId": "0",
      "StreetAddress": "Earth",
      "MsgType": "S.O.S",
      "DetectionType": "sos",
      "DetectionTypeId": "sos"
    }
  },
  "IsFailed": false,
  "Location": "POINT (0 0)",
  "SourceType": 5,
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "{{guid}}",
  "Time": "{{timestamp}}"
}` },
  { id: 10002, name: 'CShare_Location', label: 'CShare Location Detection', family: 'CShare' },
  { id: 10003, name: 'CShare_Report',   label: 'CShare Report Detection',   family: 'CShare' },
  { id: 10004, name: 'CShare_Operator', label: 'CShare Operator Detection', family: 'CShare' },
  { id: 10005, name: 'Cad_Api',         label: 'Cad Api Detection',         family: 'CAD' },
  { id: 10006, name: 'Gunshot',         label: 'Gunshot Detection',         family: 'Sensors' },
  { id: 10007, name: 'OSINT',           label: 'OSINT Detection',           family: 'Intel' },
  { id: 10008, name: 'FenceAlarm',      label: 'Fence Alarm Detection',     family: 'Fence' },
  { id: 10009, name: 'FenceTamper',     label: 'Fence Tamper Detection',    family: 'Fence' },
  { id: 10010, name: 'FenceCut',        label: 'Fence Cut Detection',       family: 'Fence' },
  { id: 10011, name: 'RadarTarget',     label: 'Radar Target Detection',    family: 'Radar',
    params: ['TargetId','TrackingId','Size','Velocity','Course','Confidence','Source'],
    note: 'Key set per the integration spec; the GenericDetection-building radar adapter was not located during verification.' },
  { id: 10012, name: 'Fence_Rx_HealthStatus',     label: 'Fence Rx HealthStatus',     family: 'Health status' },
  { id: 10013, name: 'Fence_Tx_HealthStatus',     label: 'Fence Tx HealthStatus',     family: 'Health status' },
  { id: 10014, name: 'Fence_Sensor_HealthStatus', label: 'Fence Sensor HealthStatus', family: 'Health status' },
  { id: 10015, name: 'FenceBatteryLow',           label: 'Fence Battery Low',         family: 'Fence' },
  { id: 10016, name: 'PanicButtonHealthStatus',   label: 'Panic Button Health Status', family: 'Health status' },
  { id: 10017, name: 'RadarHealthStatus',         label: 'Radar Health Status',       family: 'Health status' },
  { id: 10018, name: 'UAVPlatform',     label: 'UAV Platform',     family: 'UAV / Drone' },
  { id: 10019, name: 'UAVHealthStatus', label: 'UAV Health Status', family: 'Health status' },
  { id: 10020, name: 'ACSHealthStatus', label: 'ACS Health Status', family: 'Health status' },
  { id: 10021, name: 'ACS',             label: 'ACS Detection',    family: 'Access control',
    params: ['Id','Type','AccessMode','AccessResult','AccessDenied','BadgeId','IsBioInvolved','IsEntered','IsUnderDuress','ReaderId','ControllerId','ObjectId','SensorName'],
    note: 'Keys from the Lenel adapter TypeBuilders.cs. "Type" is "AccessEvent"; a "SecurityEvent" variant uses EventType / EventSubType / Text / Description / AuxiliaryId instead.' },
  { id: 10022, name: 'StreetLightHealthStatus', label: 'Street Light Health Status', family: 'Health status' },
  { id: 10023, name: 'CameraHealthStatus',      label: 'Camera Health Status',       family: 'Health status' },
  { id: 10024, name: 'SensorHealthStatus',      label: 'Sensor Health Status',       family: 'Health status' },
  { id: 10025, name: 'DispatchedUnit',  label: 'Dispatched Unit Detection', family: 'CAD' },
  { id: 10026, name: 'CAD',             label: 'CAD Detection',    family: 'CAD',
    params: ['operationType','latitude','longitude','altitude','agency','externalID','eventType','priority','severity'],
    note: 'Key set per the integration spec. A CAD event-notification handler in code (CADEventNotificationHandler.cs) uses a different set: incidentId, priority, severity, incidentType, remarks, unitId, fullAddress, locInfo — keys vary by CAD adapter.' },
  { id: 10027, name: 'BoschFixedHealthStatus', label: 'Bosch Fixed Health Status', family: 'Health status' },
  { id: 10028, name: 'BoschPtzHealthStatus',   label: 'Bosch PTZ Health Status',   family: 'Health status' },
  { id: 10029, name: 'PublicTransportation',   label: 'Public Transportation Detection', family: 'Transport',
    params: ['EventId','EventTypeId','InternalEventTypeId','HasVideo','Description','SensorName','PlateNumber','Group'] },
  { id: 10030, name: 'PublicTransportationLocation', label: 'Public Transportation Location Detection', family: 'Transport',
    params: ['Description','SensorName','PlateNumber','Group'] },
  { id: 10031, name: 'DroneTelemetry',  label: 'Drone Telemetry Detection', family: 'UAV / Drone',
    note: 'DroneTelemetryInfo.ToDictionary() returns an empty dictionary — data relies purely on the base PhysicalId and Location.' },

  { id: 100041, name: 'CReact_Report',   label: 'CReact Report Detection', family: 'CReact',
    params: ['CategoryId','Message','OrganizationId','Severity','Type','UserId','UserName','StreetAddress'] },
  { id: 100042, name: 'CReact_Location', label: 'CReact active user location', family: 'CReact',
    params: ['UserId','UserStatus','OrganizationId','UserName'],
    example: `{
  "GenericDetectionTypeId": 100042,
  "AdditionalParameters": {
    "_parameters": {
      "UserId": "45",
      "UserStatus": "1",
      "OrganizationId": "1",
      "UserName": "Ron"
    }
  },
  "IsFailed": false,
  "Location": "POINT (34.8401967 32.2904933)",
  "SourceType": 5,
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "{{guid}}",
  "Time": "{{timestamp}}"
}` },
  { id: 100043, name: 'MinistryOfTourism', label: 'Ministry of Tourism Panic Button', family: 'Panic button',
    params: ['RequestID','PhoneNumber','Country','State','Name','Surname','Birthday','Gender','Email','StreetAddress'] },
  { id: 100044, name: 'PanicButton', label: 'Oxxo Store Panic Button', family: 'Panic button' },
  { id: 100101, name: 'SapNati', label: 'Sap Nati', family: 'SAP', origin: 'next',
    params: ['RequestID','Action','NotificationType','NotificationNumber','SourceType','SourceName','SourcePhone','NotificationDescription','Region','Area','RoadNumber','FunctionalLocationDescription','FLNotificationStartKM','FLNotificationEndKM','LocationX','LocationY','Direction','ParentType','SecondaryType','Priority','NotifProcessingStatus','RequiredStartTime','RequiredEndTime','CreatedBy','CreatedDateTime','ChangedBy','ChangedDateTime','Vehicles','SiteType','LifeDangerFlag','SystemStatus','EventId','ReportBackToCaller','… (+ M5* / Fleet* / Yasam* extended fields)'],
    note: 'One of the largest payloads in the system (~80 keys). The list shows the core fields; SapNatiPlugin.cs also emits Fleet*, M5*, Yasam*, EventBlockage* groups.',
    example: `{
  "GenericDetectionTypeId": 100101,
  "AdditionalParameters": {
    "_parameters": {
      "RequestID": "a9f96f8...d72d",
      "Action": "C",
      "NotificationType": "M4",
      "NotificationNumber": "20260602391396",
      "SourceType": "0002",
      "SourceName": "Amit Belais",
      "SourcePhone": "0523211506",
      "NotificationDescription": "Check Station Event",
      "Region": "2000",
      "Area": "101",
      "RoadNumber": "2",
      "FunctionalLocationDescription": "IL0002-3X6D",
      "LocationX": "34.8662547960615",
      "LocationY": "32.3610349640729",
      "Direction": "U",
      "Priority": "1",
      "NotifProcessingStatus": "E0005",
      "LifeDangerFlag": "false",
      "SystemStatus": "In process"
    }
  },
  "IsFailed": false,
  "Location": "POINT (34.8662547960615 32.3610349640729 0)",
  "SourceType": 122,
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "{{guid}}",
  "Time": "{{timestamp}}"
}` },
  { id: 100102, name: 'SapPBX', label: 'Sap PBX', family: 'SAP', origin: 'next',
    params: ['CallTakername','PhoneNumber','Queuename','CallId','WaitingTime','userId'],
    note: 'Spec lists these six keys. The SapPBXPlugin.cs mapping in code primarily populates PhoneNumber.',
    example: `{
  "GenericDetectionTypeId": 100102,
  "AdditionalParameters": {
    "_parameters": {
      "CallTakername": "John Doe",
      "PhoneNumber": "052-9876543",
      "Queuename": "MAIN",
      "CallId": "CALL-001",
      "WaitingTime": "45",
      "userId": "17"
    }
  },
  "IsFailed": false,
  "Location": "POINT (34.8 32 0)",
  "SourceType": 123,
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "{{guid}}",
  "Time": "{{timestamp}}"
}` },
  { id: 100103, name: 'AlarmPanel', label: 'Alarm Control Panel', family: 'Alarm panel', origin: 'next' },
  { id: 100104, name: 'AVL',        label: 'AVL',                 family: 'Fleet / AVL', origin: 'next',
    note: 'Present in Main-Next at id 100104. In Main-Global this id is commented out and replaced by AVLLocation (100105).' },
  { id: 100105, name: 'TlsFault',   label: 'Tls Fault',           family: 'Traffic / DataHub', origin: 'next',
    params: ['TechNum','EventTypeId','DerivedStatus','SapId','StartTimeUtc','Phase'],
    note: 'From DataHub TlsMessageProcessor.cs. Phase is "Appeared" or "Cleared". NOTE: id 100105 is reused for AVLLocation in Main-Global — TlsFault is Main-Next only.',
    example: `{
  "GenericDetectionTypeId": 100105,
  "AdditionalParameters": {
    "_parameters": {
      "TechNum": "32",
      "EventTypeId": "1",
      "DerivedStatus": "4",
      "SapId": "215000032",
      "StartTimeUtc": "2026-06-01T00:00:08.2533121Z",
      "Phase": "Cleared"
    }
  },
  "IsFailed": false,
  "Location": "POINT(34.54676 32.127241 0)",
  "PhysicalId": "32",
  "SensorId": 2258,
  "SourceType": 125,
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "{{guid}}",
  "Time": "{{timestamp}}"
}` },

  /* ---- Main-Global-only generic types (not present in Main-Next) -------- */
  { id: 100105, name: 'AVLLocation', label: 'AVL Location', family: 'Fleet / AVL', origin: 'global',
    note: 'Main-Global only. Reuses id 100105 (which is TlsFault in Main-Next). AVL (100104) is commented out in Main-Global in favour of this.' },
  { id: 100106, name: 'CameraIO', label: 'Camera IO', family: 'Sensors', origin: 'global',
    params: ['TotemID','InputID','ButtonType','CorrelationId'],
    note: 'Found in Main-Global (TermID 65001855) — NOT in Main-Next. This resolves the original spec\'s CameraIO entry: it exists, just in the Global branch. Keys per spec: TotemID (firmware), InputID (I/O port), ButtonType (default "Physical"), CorrelationId (event id).' },
];

/* ---- Cross-branch comparison: Main-Next ↔ Main-Global -------------------- */
export const CODEBASE_DIFF = {
  branches: {
    next:   { label: 'Main-Next',   path: 'C:\\dev\\Main-Next' },
    global: { label: 'Main-Global', path: 'C:\\dev\\Main-Global' },
  },
  summary: 'Main-Next and Main-Global are divergent branches. The shared base classes (UniqueData / DetectionBase, 15 fields) and every detection type common to both are IDENTICAL in fields and types. The differences are: Main-Global adds a set of newer strongly-typed detections, and the two branches diverge in the high range of the GenericDetectionTypes registry.',
  baseUnchanged: true,
  globalOnlyTyped: [
    'FaceRecognition', 'EnvironmentalDetection', 'WeatherDetection', 'StructuralDetection',
    'TrafficMeasurementDetection', 'HighOccupancyTrafficDetection', 'CommonDetection',
    'DynamicLocationDetection', 'ExternalDetection', 'TelemetryInfo (UAV, standalone)',
    'WsHealthStatusNotification (extends HealthStatus, not DetectionBase)',
  ],
  coexistNotes: [
    'EnvironmentDetection (18 fields) and EnvironmentalDetection (9 pollutant fields) COEXIST in Main-Global — not a rename.',
    'FaceDetection (lean: DetectionImage/FIRs/TrackingID/BsaScore) and FaceRecognition (rich: demographics + FaceMatches) COEXIST. The captured sample payload on record is a FaceRecognition.',
  ],
  genericDiff: [
    { id: 100101, name: 'SapNati',     in: 'next',   note: 'Main-Next only — absent from Main-Global registry.' },
    { id: 100102, name: 'SapPBX',      in: 'next',   note: 'Main-Next only — absent from Main-Global registry.' },
    { id: 100103, name: 'AlarmPanel',  in: 'next',   note: 'Main-Next only — absent from Main-Global registry.' },
    { id: 100104, name: 'AVL',         in: 'next',   note: 'Main-Next only — commented out in Main-Global.' },
    { id: 100105, name: 'TlsFault',    in: 'next',   note: 'Main-Next only — id 100105 is AVLLocation in Main-Global.' },
    { id: 100105, name: 'AVLLocation', in: 'global', note: 'Main-Global only — reuses id 100105.' },
    { id: 100106, name: 'CameraIO',    in: 'global', note: 'Main-Global only (TermID 65001855). Not in Main-Next.' },
  ],
  registryFiles: [
    'Main-Next:   ...\\Binaries\\Databases\\Vulcan\\...\\Configuration.GenericDetectionTypes.sql',
    'Main-Global: ...\\City\\Database\\Vulcan\\...\\Configuration.GenericDetectionTypes.sql  (ids 100101–100104 absent; 100105 AVLLocation, 100106 CameraIO)',
  ],
  notRealGaps: 'Agent-flagged "changes" to VIDetectionFull.SegmentID, McpDetection.DetectionSubType and AggregatedSegmentData types were NOT real differences — this catalog already carried the correct types; both branches agree.',
};

export const D = {
  BASE_FIELDS, FILE_OBJECT_FIELDS, SUPPORTING_TYPES,
  TYPED_DETECTIONS, GENERIC_BASE, GENERIC_TYPES, CODEBASE_DIFF,
};
