<?php

namespace Drupal\my_custom_module\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides an ads block.
 *
 * @Block(
 *   id = "ads",
 *   admin_label = @Translation("ads"),
 *   category = @Translation("Custom")
 * )
 */
class AdsBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [
      '#theme' => 'ads'
    ];
    return $build;
  }

}
