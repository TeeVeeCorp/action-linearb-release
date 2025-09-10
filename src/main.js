const core = require('@actions/core')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const apiKey = core.getInput('api_key', { required: true })
    const repoURL = core.getInput('repo_url', { required: true })
    const refName = core.getInput('ref_name', { required: true })
    const serviceNames = core.getInput('services')

    let timestamp = core.getInput('time_stamp')
    let stage = core.getInput('stage')

    if (!timestamp) {
      timestamp = new Date().toISOString()
    }

    if (!stage) {
      stage = 'release'
    }

    let services = []

    if (serviceNames) {
      services = services.split(',').map(item => item.trim())
    }

    core.info(
      `Create LinearB release metrics for services:'${services}' in ${repoURL}`
    )

    const url = 'https://public-api.linearb.io/api/v1/deployments'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        repo_url: repoURL,
        ref_name: refName,
        services,
        timestamp,
        stage
      })
    })

    if (response.status !== 200) {
      core.setFailed(`Request failed with status ${response.status}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
