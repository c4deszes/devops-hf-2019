resource "google_container_cluster" "gke-devops-hf" {
  default_max_pods_per_node = 110
  enable_kubernetes_alpha   = false
  enable_legacy_abac        = false
  initial_node_count        = 0
  location           = "europe-west3-b"
  logging_service    = "none"
  monitoring_service = "none"
  name               = "devops-hf"
  network            = "projects/devops-hf/global/networks/default"
  node_locations     = []
  node_version       = "1.14.8-gke.17"
  project            = "devops-hf"
  subnetwork         = "projects/devops-hf/regions/europe-west3/subnetworks/default"
  ip_allocation_policy {

  }

  master_auth {
    username = ""
    password = ""
  }
}

resource "google_container_node_pool" "gke-nodes-devops-hf" {
  name               = "workers"
  cluster            = google_container_cluster.gke-devops-hf.name
  initial_node_count = 2
  max_pods_per_node = 110
  node_count        = 2
  version           = "1.14.8-gke.17"

  autoscaling {
    max_node_count = 4
    min_node_count = 2
  }

  node_config {
    disk_size_gb    = 100
    disk_type       = "pd-standard"
    image_type      = "COS"
    labels          = {}
    local_ssd_count = 0
    machine_type    = "n1-standard-4"
    oauth_scopes = [
      "https://www.googleapis.com/auth/devstorage.full_control",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append",
    ]
    preemptible     = false
    service_account = "default"
    tags            = []
    taint           = []
  }
}