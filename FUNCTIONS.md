# Hapo Cloud Technologies CMS - Backend Functions

## Authentication
- login(email: String, password: String): AuthResponse
- logout(): void
- refreshToken(refreshToken: String): AuthResponse
- getCurrentUser(): User

## User Management
- getAllUsers(page: int, size: int): Page<User>
- getUserById(id: String): User
- createUser(userData: UserDTO): User
- updateUser(id: String, userData: UserDTO): User
- deleteUser(id: String): void
- changeUserRole(id: String, role: Role): User
- getUserActivity(id: String): List<ActivityLog>

## Content Management
- getAllContent(page: int, size: int, type: String, tags: List<String>): Page<Content>
- getContentById(id: String): Content
- uploadContent(file: MultipartFile, metadata: ContentMetadata): Content
- updateContent(id: String, contentData: ContentDTO): Content
- deleteContent(id: String): void
- getContentStats(id: String): ContentStats
- addContentTags(id: String, tags: List<String>): Content
- removeContentTag(id: String, tag: String): Content

## Campaign Management
- getAllCampaigns(page: int, size: int, status: String, location: String): Page<Campaign>
- getCampaignById(id: String): Campaign
- createCampaign(campaignData: CampaignDTO): Campaign
- updateCampaign(id: String, campaignData: CampaignDTO): Campaign
- deleteCampaign(id: String): void
- changeCampaignStatus(id: String, status: CampaignStatus): Campaign
- addContentToCampaign(campaignId: String, contentIds: List<String>): Campaign
- removeContentFromCampaign(campaignId: String, contentId: String): Campaign
- scheduleCampaign(id: String, startDate: LocalDateTime, endDate: LocalDateTime): Campaign

## Screen Management
- getAllScreens(page: int, size: int, status: String): Page<Screen>
- getScreenById(id: String): Screen
- createScreen(screenData: ScreenDTO): Screen
- updateScreen(id: String, screenData: ScreenDTO): Screen
- deleteScreen(id: String): void
- getScreenStatus(id: String): ScreenStatus
- restartScreen(id: String): void
- assignContent(screenId: String, contentIds: List<String>): void

## Analytics
- getTrafficData(startDate: LocalDateTime, endDate: LocalDateTime, location: String): List<TrafficData>
- getDwellTimeData(startDate: LocalDateTime, endDate: LocalDateTime, location: String): List<DwellTimeData>
- getCampaignMetrics(campaignId: String): CampaignMetrics
- trackView(eventData: ViewEventDTO): void
- trackEngagement(eventData: EngagementEventDTO): void

## Settings Management
- getSystemSettings(): SystemSettings
- updateSystemSettings(settings: SystemSettingsDTO): SystemSettings
- getResolutions(): List<Resolution>
- createResolution(resolution: ResolutionDTO): Resolution
- updateResolution(id: String, resolution: ResolutionDTO): Resolution
- deleteResolution(id: String): void
- setDefaultResolution(id: String): Resolution

## File Management
- uploadFile(file: MultipartFile): FileUploadResponse
- deleteFile(fileId: String): void
- getFileMetadata(fileId: String): FileMetadata

## Layout Management
- getAllLayouts(page: int, size: int): Page<Layout>
- getLayoutById(id: String): Layout
- createLayout(layoutData: LayoutDTO): Layout
- updateLayout(id: String, layoutData: LayoutDTO): Layout
- deleteLayout(id: String): void
- duplicateLayout(id: String): Layout

## Schedule Management
- getAllSchedules(page: int, size: int): Page<Schedule>
- getScheduleById(id: String): Schedule
- createSchedule(scheduleData: ScheduleDTO): Schedule
- updateSchedule(id: String, scheduleData: ScheduleDTO): Schedule
- deleteSchedule(id: String): void
- getScheduleConflicts(scheduleData: ScheduleDTO): List<ScheduleConflict>

## System Operations
- getSystemHealth(): SystemHealth
- getSystemMetrics(): SystemMetrics
- clearCache(): void
- backupData(): BackupResponse
- restoreData(backupId: String): RestoreResponse