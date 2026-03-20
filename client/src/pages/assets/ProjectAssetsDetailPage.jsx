import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardBody, Button, Badge, Spinner } from '@/components/ui';
import { taskService } from '@/services/api';
import {
  ArrowLeft,
  Image,
  Video,
  Layout,
  Code,
  FileCheck,
  ExternalLink,
  Download,
  Calendar,
  User,
  Link,
  MessageSquare,
  AlertCircle,
  Eye,
} from 'lucide-react';

const TASK_TYPE_CONFIG = {
  graphic_design: { label: 'Graphic Design', icon: Image, color: 'bg-blue-100 text-blue-800' },
  video_editing: { label: 'Video Editing', icon: Video, color: 'bg-purple-100 text-purple-800' },
  landing_page_design: { label: 'UI/UX Design', icon: Layout, color: 'bg-orange-100 text-orange-800' },
  landing_page_development: { label: 'Landing Page', icon: Code, color: 'bg-green-100 text-green-800' },
  content_creation: { label: 'Content Creation', icon: FileCheck, color: 'bg-teal-100 text-teal-800' },
};

const STATUS_CONFIG = {
  final_approved: { label: 'Final Approved', color: 'bg-green-100 text-green-800' },
  design_approved: { label: 'Design Approved', color: 'bg-blue-100 text-blue-800' },
  development_approved: { label: 'Development Approved', color: 'bg-blue-100 text-blue-800' },
  approved_by_tester: { label: 'Tester Approved', color: 'bg-blue-100 text-blue-800' },
  content_final_approved: { label: 'Content Approved', color: 'bg-green-100 text-green-800' },
};

export default function ProjectAssetsDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'finalApproved'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'imageCreatives' | 'videoCreatives' | 'uiuxDesigns' | 'landingPages'

  useEffect(() => {
    fetchProjectAssets();
  }, [projectId]);

  const fetchProjectAssets = async () => {
    try {
      setLoading(true);
      const response = await taskService.getPMProjectAssets(projectId);
      setProjectData(response.data);
    } catch (error) {
      console.error('Failed to load project assets:', error);
      toast.error(error.response?.data?.message || 'Failed to load project assets');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAssets = () => {
    if (!projectData) return [];

    const assetSet = filter === 'finalApproved' ? 'finalApproved' : 'all';
    const assets = projectData.assetsByType?.[assetSet] || projectData.assets?.[assetSet] || [];

    if (typeFilter === 'all') {
      return [
        ...(assets.imageCreatives || []),
        ...(assets.videoCreatives || []),
        ...(assets.uiuxDesigns || []),
        ...(assets.landingPages || []),
      ];
    }

    return assets[typeFilter] || [];
  };

  const renderAssetCard = (task) => {
    const typeConfig = TASK_TYPE_CONFIG[task.taskType] || { label: task.taskType, icon: FileCheck, color: 'bg-gray-100 text-gray-800' };
    const statusConfig = STATUS_CONFIG[task.status] || { label: task.status, color: 'bg-gray-100 text-gray-800' };
    const Icon = typeConfig.icon;

    return (
      <Card key={task._id} className="mb-4">
        <CardBody className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={typeConfig.color}>
                  <Icon className="w-3 h-3 mr-1" />
                  {typeConfig.label}
                </Badge>
                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.taskTitle}</h3>

              {/* Strategy Context */}
              {task.strategyContext && (
                <div className="text-sm text-gray-500 mb-2">
                  {task.strategyContext.funnelStage && (
                    <span className="mr-3">Funnel: {task.strategyContext.funnelStage}</span>
                  )}
                  {task.strategyContext.platform && (
                    <span className="mr-3">Platform: {task.strategyContext.platform}</span>
                  )}
                </div>
              )}

              {/* Creative Link */}
              {task.creativeLink && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Creative Link
                  </h4>
                  <a
                    href={task.creativeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 text-sm break-all"
                  >
                    {task.creativeLink}
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>
              )}

              {/* Implementation URL for Landing Pages */}
              {task.implementationUrl && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-800 mb-1 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Landing Page URL
                  </h4>
                  <a
                    href={task.implementationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline flex items-center gap-1 text-sm break-all"
                  >
                    {task.implementationUrl}
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>
              )}

              {/* Design Link */}
              {task.designLink && (
                <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-medium text-purple-800 mb-1 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Design Link
                  </h4>
                  <a
                    href={task.designLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline flex items-center gap-1 text-sm break-all"
                  >
                    {task.designLink}
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>
              )}

              {/* Output Files */}
              {task.outputFiles && task.outputFiles.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    Output Files
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {task.outputFiles.map((file, index) => (
                      <a
                        key={index}
                        href={file.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border rounded text-sm text-blue-600 hover:bg-gray-100"
                      >
                        <Download className="w-3 h-3" />
                        {file.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {task.reviewNotes && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Notes
                  </h4>
                  <p className="text-sm text-gray-700">{task.reviewNotes}</p>
                </div>
              )}

              {task.devNotes && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Developer Notes
                  </h4>
                  <p className="text-sm text-gray-700">{task.devNotes}</p>
                </div>
              )}

              {/* Approval Info */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {task.marketerApprovedBy && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Approved by: {task.marketerApprovedBy.name || 'Marketer'}</span>
                  </div>
                )}
                {task.marketerApprovedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(task.marketerApprovedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {task.testerReviewedBy && !task.marketerApprovedBy && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Reviewed by: {task.testerReviewedBy.name || 'Tester'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardBody className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
            <p className="text-gray-500">Project not found or you don't have access</p>
            <Button className="mt-4" onClick={() => navigate('/assets')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assets
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const { project, stats, assetsByType } = projectData;
  const filteredAssets = getFilteredAssets();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/assets')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.projectName || project.businessName}
            </h1>
            {project.industry && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                {project.industry}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500">Total Assets</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats?.finalApproved || 0}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500">Image Creatives</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.byType?.imageCreatives || 0}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500">Video Creatives</p>
            <p className="text-2xl font-bold text-purple-600">{stats?.byType?.videoCreatives || 0}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500">UI/UX Designs</p>
            <p className="text-2xl font-bold text-orange-600">{stats?.byType?.uiuxDesigns || 0}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500">Landing Pages</p>
            <p className="text-2xl font-bold text-green-600">{stats?.byType?.landingPages || 0}</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('all')}
                >
                  All Assets
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'finalApproved' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('finalApproved')}
                >
                  Approved
                </Button>
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <div className="flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant={typeFilter === 'all' ? 'primary' : 'secondary'}
                  onClick={() => setTypeFilter('all')}
                >
                  All Types
                </Button>
                <Button
                  size="sm"
                  variant={typeFilter === 'imageCreatives' ? 'primary' : 'secondary'}
                  onClick={() => setTypeFilter('imageCreatives')}
                >
                  <Image className="w-3 h-3 mr-1" />
                  Images
                </Button>
                <Button
                  size="sm"
                  variant={typeFilter === 'videoCreatives' ? 'primary' : 'secondary'}
                  onClick={() => setTypeFilter('videoCreatives')}
                >
                  <Video className="w-3 h-3 mr-1" />
                  Videos
                </Button>
                <Button
                  size="sm"
                  variant={typeFilter === 'uiuxDesigns' ? 'primary' : 'secondary'}
                  onClick={() => setTypeFilter('uiuxDesigns')}
                >
                  <Layout className="w-3 h-3 mr-1" />
                  UI/UX
                </Button>
                <Button
                  size="sm"
                  variant={typeFilter === 'landingPages' ? 'primary' : 'secondary'}
                  onClick={() => setTypeFilter('landingPages')}
                >
                  <Code className="w-3 h-3 mr-1" />
                  Landing Pages
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Assets List */}
      {filteredAssets.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <FileCheck className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No assets found matching your filters</p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters or check back later
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAssets.map(renderAssetCard)}
        </div>
      )}
    </div>
  );
}