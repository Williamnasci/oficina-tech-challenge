provider "kind" {}

resource "kind_cluster" "oficina" {
  name            = var.cluster_name
  wait_for_ready  = true
  kubeconfig_path = abspath(var.kubeconfig_path)

  kind_config {
    kind        = "Cluster"
    api_version = "kind.x-k8s.io/v1alpha4"

    node {
      role = "control-plane"
    }

    node {
      role = "worker"
    }

    node {
      role = "worker"
    }
  }
}
