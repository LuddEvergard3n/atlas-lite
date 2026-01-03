#include <emscripten.h>
#include <math.h>
#include <stdlib.h>

// === REGRESSÃO LINEAR ===
EMSCRIPTEN_KEEPALIVE
double linear_regression_slope(double* x, double* y, int n) {
    if (n < 2) return 0.0;
    double sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0;
    for (int i = 0; i < n; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += x[i] * y[i];
        sum_xx += x[i] * x[i];
    }
    double denom = n * sum_xx - sum_x * sum_x;
    if (fabs(denom) < 1e-10) return 0.0;
    return (n * sum_xy - sum_x * sum_y) / denom;
}

EMSCRIPTEN_KEEPALIVE
double linear_regression_intercept(double* x, double* y, int n) {
    if (n < 2) return 0.0;
    double sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0;
    for (int i = 0; i < n; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += x[i] * y[i];
        sum_xx += x[i] * x[i];
    }
    double denom = n * sum_xx - sum_x * sum_x;
    if (fabs(denom) < 1e-10) return sum_y / n;
    double slope = (n * sum_xy - sum_x * sum_y) / denom;
    return (sum_y - slope * sum_x) / n;
}

EMSCRIPTEN_KEEPALIVE
double predict_value(double slope, double intercept, double x) {
    return slope * x + intercept;
}

// === MÉDIA MÓVEL ===
EMSCRIPTEN_KEEPALIVE
void moving_average(double* data, double* result, int n, int window) {
    if (window < 1 || n < 1) return;
    for (int i = 0; i < n; i++) {
        double sum = 0;
        int count = 0;
        for (int j = (i - window + 1 > 0 ? i - window + 1 : 0); j <= i; j++) {
            sum += data[j];
            count++;
        }
        result[i] = sum / count;
    }
}

// === ÍNDICE DE CONSISTÊNCIA ===
EMSCRIPTEN_KEEPALIVE
double consistency_index(int* active_days, int n, int total_days) {
    if (total_days < 1 || n < 1) return 0.0;
    
    int streaks = 0, current_streak = 0, max_streak = 0;
    int gaps = 0, max_gap = 0, current_gap = 0;
    int last_active = -1;
    
    for (int i = 0; i < n; i++) {
        if (active_days[i]) {
            if (current_gap > 0) {
                gaps++;
                if (current_gap > max_gap) max_gap = current_gap;
            }
            current_gap = 0;
            current_streak++;
            if (current_streak > max_streak) max_streak = current_streak;
            last_active = i;
        } else {
            if (current_streak > 0) streaks++;
            current_streak = 0;
            if (last_active >= 0) current_gap++;
        }
    }
    
    double frequency = (double)n / total_days;
    double streak_score = (double)max_streak / total_days;
    double gap_penalty = max_gap > 0 ? 1.0 / (1.0 + log(max_gap)) : 1.0;
    double recovery_bonus = gaps > 0 ? 0.1 * (gaps > 5 ? 5 : gaps) : 0;
    
    double score = (frequency * 40 + streak_score * 30 + gap_penalty * 20 + recovery_bonus * 10);
    return score > 100 ? 100 : (score < 0 ? 0 : score);
}

// === REVISÃO ESPAÇADA (SM-2) ===
EMSCRIPTEN_KEEPALIVE
int sm2_next_interval(int repetition, double easiness, int prev_interval) {
    if (repetition == 0) return 1;
    if (repetition == 1) return 6;
    return (int)(prev_interval * easiness + 0.5);
}

EMSCRIPTEN_KEEPALIVE
double sm2_update_easiness(double easiness, int quality) {
    double new_ef = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    return new_ef < 1.3 ? 1.3 : new_ef;
}

EMSCRIPTEN_KEEPALIVE
int sm2_should_reset(int quality) {
    return quality < 3 ? 1 : 0;
}

// === CORRELAÇÃO DE PEARSON ===
EMSCRIPTEN_KEEPALIVE
double pearson_correlation(double* x, double* y, int n) {
    if (n < 2) return 0.0;
    double sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0, sum_yy = 0;
    for (int i = 0; i < n; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += x[i] * y[i];
        sum_xx += x[i] * x[i];
        sum_yy += y[i] * y[i];
    }
    double num = n * sum_xy - sum_x * sum_y;
    double denom = sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y));
    if (fabs(denom) < 1e-10) return 0.0;
    return num / denom;
}

// === DIFF DE SNAPSHOTS ===
EMSCRIPTEN_KEEPALIVE
double percent_change(double old_val, double new_val) {
    if (fabs(old_val) < 1e-10) return new_val > 0 ? 100.0 : 0.0;
    return ((new_val - old_val) / fabs(old_val)) * 100.0;
}

EMSCRIPTEN_KEEPALIVE
double absolute_change(double old_val, double new_val) {
    return new_val - old_val;
}

// === DETECÇÃO DE TENDÊNCIA ===
EMSCRIPTEN_KEEPALIVE
int detect_trend(double slope, double mean_y) {
    if (fabs(mean_y) < 1e-10) return 0;
    double normalized = slope / fabs(mean_y);
    if (normalized > 0.05) return 1;   // crescimento
    if (normalized < -0.05) return -1; // queda
    return 0; // estagnação
}

// === PROJEÇÃO PARA META ===
EMSCRIPTEN_KEEPALIVE
int days_to_goal(double current, double goal, double daily_rate) {
    if (daily_rate <= 0) return -1;
    if (current >= goal) return 0;
    return (int)ceil((goal - current) / daily_rate);
}