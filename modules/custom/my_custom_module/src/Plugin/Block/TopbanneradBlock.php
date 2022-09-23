<?php

namespace Drupal\my_custom_module\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a topbannerad block.
 *
 * @Block(
 *   id = "topbannerad",
 *   admin_label = @Translation("topbannerad"),
 *   category = @Translation("Custom")
 * )
 */
class TopbanneradBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [
      '#theme' => 'topbannerad'
    ];
    return $build;
  }

}
